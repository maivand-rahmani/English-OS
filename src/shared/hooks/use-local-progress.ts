"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAllProgressEntries,
  updateProgress as updateProgressStore,
  getProgressEntry,
  putProgressEntry,
  deleteProgressEntry,
} from "@/shared/persistence";
import type { BlockState, ProgressEntry } from "@/shared/types";

/**
 * Hook for reading and updating local progress state.
 *
 * Progress entries are stored in IndexedDB. The hook provides
 * optimistic inline state updates — the list reflects changes
 * immediately without waiting for a database read-back.
 */
export function useLocalProgress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await getAllProgressEntries();
      setEntries(result);
    } catch (error) {
      console.error("Failed to load progress entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Update a single progress entry. Optimistic inline update. */
  const updateEntry = useCallback(
    async (
      id: string,
      state: BlockState,
      meta?: Record<string, string>
    ) => {
      const now = Date.now();

      // Optimistic inline update
      setEntries((prev) => {
        const existing = prev.find((e) => e.id === id);
        const entry: ProgressEntry = {
          id,
          entryType: existing?.entryType ?? "block",
          state,
          updatedAt: now,
          meta: meta ?? existing?.meta,
        };

        if (existing) {
          return prev.map((e) => (e.id === id ? entry : e));
        }
        return [...prev, entry];
      });

      // Persist to IndexedDB
      try {
        await updateProgressStore({ id, state, meta });
      } catch (error) {
        console.error("Failed to update progress entry:", error);
      }
    },
    []
  );

  /** Get a single entry (from indexed state or IndexedDB). */
  const getEntry = useCallback(
    async (id: string): Promise<ProgressEntry | undefined> => {
      const cached = entries.find((e) => e.id === id);
      if (cached) return cached;

      try {
        return await getProgressEntry(id);
      } catch {
        return undefined;
      }
    },
    [entries]
  );

  /** Persist an entry directly (bypasses optimistic update pattern). */
  const saveEntry = useCallback(async (entry: ProgressEntry) => {
    try {
      await putProgressEntry(entry);
      setEntries((prev) => {
        const exists = prev.some((e) => e.id === entry.id);
        if (exists) {
          return prev.map((e) => (e.id === entry.id ? entry : e));
        }
        return [...prev, entry];
      });
    } catch (error) {
      console.error("Failed to save progress entry:", error);
    }
  }, []);

  /** Remove a progress entry. */
  const removeEntry = useCallback(async (id: string) => {
    try {
      await deleteProgressEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete progress entry:", error);
    }
  }, []);

  return {
    entries,
    isLoading,
    updateEntry,
    getEntry,
    saveEntry,
    removeEntry,
    refresh,
  } as const;
}
