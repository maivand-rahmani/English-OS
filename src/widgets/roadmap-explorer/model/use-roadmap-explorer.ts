"use client";

import { useLearningContentProgress } from "@/shared/hooks";
import type { ProgressEntry } from "@/shared/types";

import type { RoadmapExplorerProps } from "./roadmap-explorer-types";

export function useRoadmapExplorer({ content }: RoadmapExplorerProps) {
  const progress = useLearningContentProgress(12);
  const allBlocks = content.stages.flatMap((stage) => stage.blocks);
  const progressById = new Map(progress.entries.map((entry) => [entry.id, entry]));
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

  return {
    activeStage,
    allBlocks,
    busyAction: progress.busyAction,
    completedBlocks,
    isLoading: progress.isLoading,
    nextBlock,
    progressById,
    roadmapCompletion,
    stages: content.stages,
    updateBlockState: progress.updateBlockState,
  } as const;
}

function getEntryState(entry: ProgressEntry | undefined) {
  return entry?.state ?? "not_started";
}
