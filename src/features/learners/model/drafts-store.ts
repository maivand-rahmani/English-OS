import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import { idbStorage } from "@/shared/storage/idb-storage";
import type { Draft, DraftSummary } from "@/shared/types";

type DraftsState = {
  drafts: Draft[];
  isLoading: boolean;
  error: string | null;
};

type DraftsActions = {
  loadDrafts: () => Promise<void>;
  createDraft: (
    title: string,
    content: string,
    taskId?: string,
  ) => Promise<Draft>;
  saveDraft: (draft: Draft) => Promise<void>;
  getDraft: (id: string) => Draft | undefined;
  removeDraft: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
};

type DraftsStore = DraftsState & DraftsActions;

export const useDraftsStore = create<DraftsStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      isLoading: false,
      error: null,

      loadDrafts: async () => {
        // Zustand `persist` middleware hydrates the store from IDB on init.
        // This action is kept for API compatibility but normalizes loading
        // state only — the drafts array is already in memory.
        set({ isLoading: false, error: null });
      },

      createDraft: async (title, content, taskId) => {
        const now = Date.now();
        const draft: Draft = {
          id: crypto.randomUUID(),
          title,
          content,
          taskId,
          createdAt: now,
          updatedAt: now,
          submissionCount: 0,
        };

        set((s) => ({ drafts: [...s.drafts, draft], error: null }));
        return draft;
      },

      saveDraft: async (draft) => {
        const updated = { ...draft, updatedAt: Date.now() };

        set((s) => ({
          drafts: s.drafts.map((d) =>
            d.id === updated.id ? updated : d,
          ),
          error: null,
        }));
      },

      getDraft: (id) => get().drafts.find((d) => d.id === id),

      removeDraft: async (id) => {
        set((s) => ({
          drafts: s.drafts.filter((d) => d.id !== id),
          error: null,
        }));
      },

      clearAll: async () => {
        set({ drafts: [], error: null });
      },

      refresh: async () => {
        await get().loadDrafts();
      },
    }),
    {
      name: "drafts-state",
      storage: idbStorage("drafts"),
      partialize: (state) => ({ drafts: state.drafts }),
    },
  ),
);

/**
 * Selector hook that projects full `Draft[]` into lightweight `DraftSummary[]`
 * sorted by `updatedAt` descending.
 *
 * Rather than storing a separate summary array, summaries are derived on
 * every render.  The `useShallow` comparator ensures stable reference identity
 * — consumers only re-render when the sorted summary list actually changes
 * (i.e. when a draft is added, removed, updated, or reordered).
 *
 * ## Why project on demand?
 *
 * - Full drafts are kept in state so opening a single draft doesn't require
 *   an additional IndexedDB read.
 * - Summaries are cheap to compute (O(n)) and the `useShallow` comparison
 *   prevents wasted renders.
 * - Avoids the sync burden of maintaining two separate arrays.
 *
 * @example
 * ```ts
 * import { useDraftSummaries } from "@/features/learners/model/drafts-store";
 *
 * function DraftList() {
 *   const summaries = useDraftSummaries();
 *   return summaries.map((s) => <DraftCard key={s.id} summary={s} />);
 * }
 * ```
 */
export const useDraftSummaries = (): DraftSummary[] =>
  useDraftsStore(
    useShallow((s: DraftsStore) =>
      s.drafts
        .map(({ content: _ignored, ...summary }) => summary)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    ),
  );
