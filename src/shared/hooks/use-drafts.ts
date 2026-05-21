"use client";

import { useCallback, useEffect, useState } from "react";

import {
  listDrafts,
  putDraft,
  getDraft as getDraftFromStore,
  deleteDraft as deleteDraftFromStore,
} from "@/shared/persistence";
import type { Draft, DraftSummary } from "@/shared/types";

/**
 * Hook for managing local writing drafts.
 *
 * Drafts are stored in IndexedDB. The hook provides CRUD operations
 * and keeps the draft list in sync.
 */
export function useDrafts() {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await listDrafts();
      setDrafts(result);
    } catch (error) {
      console.error("Failed to load drafts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDrafts() {
      try {
        const result = await listDrafts();
        if (!cancelled) {
          setDrafts(result);
        }
      } catch (error) {
        console.error("Failed to load drafts:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDrafts();

    return () => {
      cancelled = true;
    };
  }, []);

  /** Create a new draft and persist immediately. */
  const createDraft = useCallback(
    async (
      title: string,
      content: string,
      taskId?: string
    ): Promise<Draft> => {
      const now = Date.now();
      const draft: Draft = {
        id: crypto.randomUUID(),
        title,
        content,
        taskId,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await putDraft(draft);
        setDrafts((prev) =>
          upsertDraftSummary(prev, {
            id: draft.id,
            title: draft.title,
            taskId: draft.taskId,
            updatedAt: draft.updatedAt,
          })
        );
        return draft;
      } catch (error) {
        console.error("Failed to create draft:", error);
        throw error;
      }
    },
    []
  );

  /** Save (update) an existing draft. */
  const saveDraft = useCallback(async (draft: Draft) => {
    const updated = { ...draft, updatedAt: Date.now() };

    try {
      await putDraft(updated);
      setDrafts((prev) =>
        upsertDraftSummary(prev, {
          id: updated.id,
          title: updated.title,
          taskId: updated.taskId,
          updatedAt: updated.updatedAt,
        })
      );
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, []);

  /** Load a single draft with full content. */
  const getDraft = useCallback(
    async (id: string): Promise<Draft | undefined> => {
      try {
        return await getDraftFromStore(id);
      } catch {
        return undefined;
      }
    },
    []
  );

  /** Delete a draft. */
  const removeDraft = useCallback(async (id: string) => {
    try {
      await deleteDraftFromStore(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  }, []);

  return {
    drafts,
    isLoading,
    createDraft,
    saveDraft,
    getDraft,
    removeDraft,
    refresh,
  } as const;
}

function upsertDraftSummary(
  drafts: DraftSummary[],
  nextDraft: DraftSummary
): DraftSummary[] {
  return [...drafts.filter((draft) => draft.id !== nextDraft.id), nextDraft]
    .sort((left, right) => right.updatedAt - left.updatedAt);
}
