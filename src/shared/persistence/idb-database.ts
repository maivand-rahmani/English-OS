/**
 * Singleton IndexedDB connection manager for English OS.
 *
 * Opens the "english-os" database once and reuses the connection
 * across all persistence modules. The upgrade callback defines
 * the schema (object stores and indexes).
 */

const DB_NAME = "english-os";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("learning_events")) {
        const eventsStore = db.createObjectStore("learning_events", {
          keyPath: "id",
        });
        eventsStore.createIndex("type", "type", { unique: false });
        eventsStore.createIndex("timestamp", "timestamp", { unique: false });
        eventsStore.createIndex("synced", "synced", { unique: false });
      }

      if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("drafts")) {
        const draftsStore = db.createObjectStore("drafts", { keyPath: "id" });
        draftsStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Returns a promise that resolves to the shared IDBDatabase instance.
 *
 * Call this once per module — subsequent calls return the cached promise.
 */
export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  return dbPromise;
}

/**
 * Resets the cached connection (useful in tests or after schema changes).
 */
export function resetDb(): void {
  if (dbPromise) {
    dbPromise.then((db) => db.close()).catch(() => {});
    dbPromise = null;
  }
}
