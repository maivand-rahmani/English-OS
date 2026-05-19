import { getDb } from "./idb-database";
import type { ProgressEntry, ProgressUpdate } from "@/shared/types";

/**
 * Save or update a single progress entry.
 */
export async function putProgressEntry(
  entry: ProgressEntry
): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite");
    const store = tx.objectStore("progress");
    store.put(entry);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Batch-update multiple progress entries in a single transaction.
 */
export async function putProgressEntries(
  entries: ProgressEntry[]
): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite");
    const store = tx.objectStore("progress");

    for (const entry of entries) {
      store.put(entry);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get a single progress entry by id.
 */
export async function getProgressEntry(
  id: string
): Promise<ProgressEntry | undefined> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readonly");
    const store = tx.objectStore("progress");
    const request = store.get(id);

    request.onsuccess = () =>
      resolve(request.result as ProgressEntry | undefined);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all progress entries.
 */
export async function getAllProgressEntries(): Promise<ProgressEntry[]> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readonly");
    const store = tx.objectStore("progress");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as ProgressEntry[]);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a progress entry by id.
 */
export async function deleteProgressEntry(id: string): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite");
    const store = tx.objectStore("progress");
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Apply a progress update (creates or overwrites the entry with
 * the current timestamp).
 */
export async function updateProgress(
  update: ProgressUpdate
): Promise<void> {
  const entry: ProgressEntry = {
    id: update.id,
    entryType: "block",
    state: update.state,
    updatedAt: Date.now(),
    meta: update.meta,
  };

  return putProgressEntry(entry);
}

/**
 * Clear all progress entries.
 */
export async function clearProgress(): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("progress", "readwrite");
    const store = tx.objectStore("progress");
    store.clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
