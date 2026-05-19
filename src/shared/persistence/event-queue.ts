import { getDb } from "./idb-database";
import type { LearningEvent } from "@/shared/types";

/**
 * Append a learning event to the local queue.
 *
 * Events are stored in IndexedDB and marked as `synced: false`
 * until a future sync batch confirms them server-side.
 */
export async function appendEvent(event: LearningEvent): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readwrite");
    const store = tx.objectStore("learning_events");
    store.add(event);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Append multiple events in a single transaction.
 */
export async function appendEvents(
  events: LearningEvent[]
): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readwrite");
    const store = tx.objectStore("learning_events");

    for (const event of events) {
      store.add(event);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Returns all events that have not yet been synced to the server.
 */
export async function getUnsyncedEvents(): Promise<LearningEvent[]> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readonly");
    const store = tx.objectStore("learning_events");
    const index = store.index("synced");
    const request = index.getAll(IDBKeyRange.only(false));

    request.onsuccess = () => resolve(request.result as LearningEvent[]);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Mark a batch of events as synced.
 */
export async function markEventsSynced(ids: string[]): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readwrite");
    const store = tx.objectStore("learning_events");

    let remaining = ids.length;

    for (const id of ids) {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const event = getRequest.result as LearningEvent | undefined;
        if (event) {
          store.put({ ...event, synced: true });
        }
        remaining--;
        if (remaining === 0) resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
    }

    if (ids.length === 0) resolve();

    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Query events with optional filters.
 */
export async function getEvents(options?: {
  type?: string;
  limit?: number;
  order?: "asc" | "desc";
}): Promise<LearningEvent[]> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readonly");
    const store = tx.objectStore("learning_events");

    if (options?.type) {
      const index = store.index("type");
      const request = index.getAll(options.type, options.limit);
      request.onsuccess = () => resolve(request.result as LearningEvent[]);
      request.onerror = () => reject(request.error);
    } else {
      const index = store.index("timestamp");
      const direction = options?.order === "asc" ? "next" : "prev";
      const request = index.openCursor(null, direction);

      const results: LearningEvent[] = [];
      const limit = options?.limit ?? Infinity;

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value as LearningEvent);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    }
  });
}

/**
 * Clear all events from the local queue.
 * Useful for resetting state during development.
 */
export async function clearEvents(): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("learning_events", "readwrite");
    const store = tx.objectStore("learning_events");
    store.clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
