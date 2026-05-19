import { getDb } from "./idb-database";
import type { Draft, DraftSummary } from "@/shared/types";

/**
 * Save or update a draft.
 *
 * If the draft already exists (same id), it is overwritten.
 */
export async function putDraft(draft: Draft): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    store.put(draft);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get a single draft by id.
 */
export async function getDraft(id: string): Promise<Draft | undefined> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readonly");
    const store = tx.objectStore("drafts");
    const request = store.get(id);

    request.onsuccess = () =>
      resolve(request.result as Draft | undefined);
    request.onerror = () => reject(request.error);
  });
}

/**
 * List all drafts as lightweight summaries (content excluded).
 *
 * Sorted by `updatedAt` descending (most recent first).
 */
export async function listDrafts(): Promise<DraftSummary[]> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readonly");
    const store = tx.objectStore("drafts");
    const index = store.index("updatedAt");
    const request = index.openCursor(null, "prev");

    const summaries: DraftSummary[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const draft = cursor.value as Draft;
        summaries.push({
          id: draft.id,
          title: draft.title,
          taskId: draft.taskId,
          updatedAt: draft.updatedAt,
        });
        cursor.continue();
      } else {
        resolve(summaries);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a draft by id.
 */
export async function deleteDraft(id: string): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clear all drafts.
 */
export async function clearDrafts(): Promise<void> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    store.clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
