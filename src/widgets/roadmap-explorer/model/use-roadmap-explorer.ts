"use client";

import { useCallback, useEffect, useState } from "react";

import { useEventsStore } from "@/features/learners/model/events-store";
import { useProgressStore } from "@/features/learners/model/progress-store";
import type { DashboardBlock } from "@/entities/dashboard";
import {
  LearningEventType,
  type BlockState,
  type ProgressEntry,
} from "@/shared/types";

import type { RoadmapExplorerProps } from "./roadmap-explorer-types";

type BlockProgressTarget = {
  id: string;
  title: string;
  stageId: string;
  stageTitle: string;
};

type BlockAction = "start" | "complete" | "review" | "difficult" | "skip" | "reset";

export function useRoadmapExplorer({ content }: RoadmapExplorerProps) {
  const [error, setError] = useState<string | null>(null);
  const entries = useProgressStore((s) => s.entries);
  const progressLoading = useProgressStore((s) => s.isLoading);
  const updateEntry = useProgressStore((s) => s.updateEntry);
  const recordEvent = useEventsStore((s) => s.recordEvent);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  let allBlocks: DashboardBlock[] = [];
  try {
    allBlocks = content.stages.flatMap((stage) => stage.blocks);
  } catch {
    allBlocks = [];
  }
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const completedBlocks = allBlocks.filter(
    (block) => getEntryState(progressById.get(block.id)) === "completed",
  ).length;
  const roadmapCompletion = allBlocks.length
    ? Math.round((completedBlocks / allBlocks.length) * 100)
    : 0;
  const nextBlock =
    allBlocks.find((block) => {
      const state = getEntryState(progressById.get(block.id));
      return state !== "completed" && state !== "skipped_for_now";
    }) ?? allBlocks.at(-1) ?? null;
  const activeStage =
    content.stages.find((stage) =>
      stage.blocks.some((block) => {
        const state = getEntryState(progressById.get(block.id));
        return state !== "completed" && state !== "skipped_for_now";
      }),
    ) ??
    content.stages[0] ??
    null;

  // Validate data integrity on content changes
  useEffect(() => {
    try {
      if (content.stages.length > 0 && allBlocks.length === 0) {
        throw new Error("Roadmap stages are missing blocks");
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load roadmap");
    }
  }, [content, allBlocks.length]);

  async function updateBlockState(
    block: BlockProgressTarget,
    nextState: BlockState,
    action: BlockAction,
  ) {
    setBusyAction(`block:${block.id}:${action}`);

    try {
      await updateEntry(
        block.id,
        nextState,
        { label: block.title, stageTitle: block.stageTitle },
        "block",
      );

      if (action === "start") {
        await recordEvent({
          type: LearningEventType.BlockStarted,
          payload: {
            blockId: block.id,
            blockLabel: block.title,
            stageId: block.stageId,
          },
        });
      }

      if (action === "complete") {
        await recordEvent({
          type: LearningEventType.BlockCompleted,
          payload: {
            blockId: block.id,
            blockLabel: block.title,
            stageId: block.stageId,
          },
        });
      }

      if (action === "skip") {
        await recordEvent({
          type: LearningEventType.ItemSkipped,
          payload: {
            itemId: block.id,
            itemType: "block",
            reason: `Skipped for now inside ${block.stageTitle.toLowerCase()}.`,
          },
        });
      }

      if (action === "difficult") {
        await recordEvent({
          type: LearningEventType.ReviewDone,
          payload: {
            reviewItemId: block.id,
            sourceType: "block",
            outcome: "still_difficult",
          },
        });
      }
    } finally {
      setBusyAction(null);
    }
  }

  return {
    activeStage,
    allBlocks,
    busyAction,
    clearError,
    completedBlocks,
    error,
    isLoading: progressLoading,
    nextBlock,
    progressById,
    roadmapCompletion,
    stages: content.stages,
    updateBlockState,
  } as const;
}

function getEntryState(entry: ProgressEntry | undefined) {
  return entry?.state ?? "not_started";
}
