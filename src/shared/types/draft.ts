/**
 * A learner writing draft persisted in IndexedDB.
 *
 * Drafts are local-first — the UI saves them immediately
 * without requiring a server round-trip.
 */
export type Draft = {
  id: string;
  title: string;
  content: string;
  taskId?: string;
  createdAt: number;
  updatedAt: number;
};

/** Lightweight summary returned by list queries (avoids loading full content). */
export type DraftSummary = {
  id: string;
  title: string;
  taskId?: string;
  updatedAt: number;
};
