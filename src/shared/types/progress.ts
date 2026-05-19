export type BlockState =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_review"
  | "skipped_for_now";

export type ProgressEntryType = "block" | "resource" | "review";

export type ProgressEntry = {
  id: string;
  entryType: ProgressEntryType;
  state: BlockState;
  updatedAt: number;
  /** Optional metadata for the entry (e.g. block label, resource title). */
  meta?: Record<string, string>;
};

/**
 * The aggregate local progress snapshot.
 *
 * Stored in IndexedDB and updated synchronously after learner actions.
 */
export type ProgressState = {
  entries: Record<string, ProgressEntry>;
  version: number;
};

export type ProgressUpdate = {
  id: string;
  state: BlockState;
  meta?: Record<string, string>;
};
