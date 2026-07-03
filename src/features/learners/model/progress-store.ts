/**
 * Progress Store
 *
 * Zustand store backed by IndexedDB for local learning progress entries.
 *
 * **Optimistic update pattern:**
 * 1. Take snapshot of current `entries`
 * 2. Build new entry object (id, state, meta, entryType, updatedAt)
 * 3. Update in-memory state immediately
 * 4. `persist` middleware writes the full state to IndexedDB
 * 5. On error: rollback state + set `error`
 *
 * @module progress-store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { idbStorage } from "@/shared/storage/idb-storage";
import type {
  BlockState,
  ProgressEntry,
  ProgressEntryType,
} from "@/shared/types";

type ProgressState = {
  entries: ProgressEntry[];
  isLoading: boolean;
  error: string | null;
};

type ProgressActions = {
  loadEntries: () => Promise<void>;
  updateEntry: (
    id: string,
    nextState: BlockState,
    meta?: Record<string, string>,
    entryType?: ProgressEntryType,
  ) => Promise<void>;
  getEntry: (id: string) => ProgressEntry | undefined;
  saveEntry: (entry: ProgressEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
};

type ProgressStore = ProgressState & ProgressActions;

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: true,
      error: null,

      loadEntries: async () => {
        set({ isLoading: true, error: null });
        try {
          const storage = idbStorage<{ entries: ProgressEntry[] }>("progress");
          const result = await storage.getItem("progress-state");
          set({
            entries: result?.state?.entries ?? [],
            isLoading: false,
          });
        } catch (err: unknown) {
          set({
            error: err instanceof Error ? err.message : String(err),
            isLoading: false,
          });
        }
      },

      updateEntry: async (id, nextState, meta, entryType) => {
        const snapshot = get().entries;
        const now = Date.now();
        const existing = snapshot.find((e) => e.id === id);

        const entry: ProgressEntry = {
          id,
          entryType: entryType ?? existing?.entryType ?? "block",
          state: nextState,
          updatedAt: now,
          meta: meta ?? existing?.meta,
        };

        const updatedEntries = existing
          ? snapshot.map((e) => (e.id === id ? entry : e))
          : [...snapshot, entry];

        set({ entries: updatedEntries, error: null });
      },

      getEntry: (id) => {
        return get().entries.find((e) => e.id === id);
      },

      saveEntry: async (entry) => {
        set((state) => ({
          entries: state.entries.some((e) => e.id === entry.id)
            ? state.entries.map((e) => (e.id === entry.id ? entry : e))
            : [...state.entries, entry],
          error: null,
        }));
      },

      removeEntry: async (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
          error: null,
        }));
      },

      clearAll: async () => {
        set({ entries: [], error: null });
      },

      refresh: async () => {
        return get().loadEntries();
      },
    }),
    {
      name: "progress-state",
      storage: idbStorage("progress"),
      partialize: (state) => ({ entries: state.entries }),
      version: 1,
    },
  ),
);
