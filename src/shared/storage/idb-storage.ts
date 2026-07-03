import type { PersistStorage, StorageValue } from "zustand/middleware";

const DEFAULT_DB_NAME = "english-os";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DEFAULT_DB_NAME, DB_VERSION);

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
 * The connection is cached at module scope so every `idbStorage` adapter
 * in the app reuses the same handle. The schema (object stores + indexes)
 * is defined once in `openDatabase` and shared with the legacy layout.
 */
function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  return dbPromise;
}

/**
 * Closes the cached connection and clears the cache. Used by the
 * version-bump path in `ensureStoreExists` so the next `getDb()` call
 * opens a fresh handle at the new version.
 */
function resetDb(): void {
  if (dbPromise) {
    dbPromise.then((db) => db.close()).catch(() => {});
    dbPromise = null;
  }
}

/**
 * Ensures the requested object store exists in the database,
 * bumping the DB version if necessary.  This is a no-op when the
 * store already exists.
 */
async function ensureStoreExists(
  db: IDBDatabase,
  storeName: string,
  dbName: string,
): Promise<void> {
  if (db.objectStoreNames.contains(storeName)) return;

  // The store doesn't exist in the current schema — bump the version
  // so `onupgradeneeded` fires and we can create it.
  db.close();
  resetDb();

  const newVersion = db.version + 1;

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName, newVersion);

    request.onupgradeneeded = () => {
      const upgradedDb = request.result;
      if (!upgradedDb.objectStoreNames.contains(storeName)) {
        upgradedDb.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      // Close the temporary upgrade connection — the next call to
      // `getDb()` will open a fresh handle at the new version.
      request.result.close();
      resolve();
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to upgrade IndexedDB"));
    };
  });
}

/**
 * Creates a Zustand `persist` storage adapter backed by IndexedDB.
 *
 * Each adapter is bound to a specific object store (`storeName`).
 * Records use `{ id: string, value: StorageValue<T> }` shape with `id`
 * as the primary key.  Zustand's `persist` middleware passes its `name`
 * option as the `id`, so the entire persisted state lives in a single
 * record per store.
 *
 * @param storeName - IndexedDB object store name.
 * @param dbName    - IndexedDB database name (defaults to `"english-os"`).
 */
export function idbStorage<T = unknown>(
  storeName: string,
  dbName: string = DEFAULT_DB_NAME,
): PersistStorage<T> {
  if (typeof indexedDB === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  /** Get a DB handle, ensuring the target store exists. */
  const getDbWithStore = async (): Promise<IDBDatabase> => {
    const db = await getDb();
    await ensureStoreExists(db, storeName, dbName);
    return getDb();
  };

  return {
    getItem: async (name) => {
      try {
        const db = await getDbWithStore();
        return new Promise<StorageValue<T> | null>((resolve) => {
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);
          const req = store.get(name);

          req.onsuccess = () => {
            const record = req.result as
              | { value: StorageValue<T> }
              | undefined;
            resolve(record?.value ?? null);
          };

          req.onerror = () => {
            console.error(
              `[idbStorage] getItem error for "${name}":`,
              req.error,
            );
            resolve(null);
          };
        });
      } catch (err) {
        console.error(`[idbStorage] getItem failed for "${name}":`, err);
        return null;
      }
    },

    setItem: async (name, value) => {
      try {
        const db = await getDbWithStore();
        await new Promise<void>((resolve) => {
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          store.put({ id: name, value });

          tx.oncomplete = () => resolve();
          tx.onerror = () => {
            console.error(
              `[idbStorage] setItem error for "${name}":`,
              tx.error,
            );
            resolve();
          };
        });
      } catch (err) {
        console.error(`[idbStorage] setItem failed for "${name}":`, err);
      }
    },

    removeItem: async (name) => {
      try {
        const db = await getDbWithStore();
        await new Promise<void>((resolve) => {
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          store.delete(name);

          tx.oncomplete = () => resolve();
          tx.onerror = () => {
            console.error(
              `[idbStorage] removeItem error for "${name}":`,
              tx.error,
            );
            resolve();
          };
        });
      } catch (err) {
        console.error(`[idbStorage] removeItem failed for "${name}":`, err);
      }
    },
  };
}
