"use client";

import { useState } from "react";

import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import { LearningEventType, type BlockState } from "@/shared/types";

export type BlockProgressTarget = {
  id: string;
  title: string;
  stageId: string;
  stageTitle: string;
};

export type ResourceProgressTarget = {
  id: string;
  title: string;
  blockTitle: string;
};

export function useLearningContentProgress(limit = 20) {
  const { entries, isLoading: progressLoading, updateEntry } = useLocalProgress();
  const { events, isLoading: eventsLoading, recordEvent } = useLearningEvents(limit);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function updateBlockState(
    block: BlockProgressTarget,
    nextState: BlockState,
    action: "start" | "complete" | "review" | "difficult" | "skip" | "reset",
  ) {
    setBusyAction(`block:${block.id}:${action}`);

    try {
      await updateEntry(
        block.id,
        nextState,
        {
          label: block.title,
          stageTitle: block.stageTitle,
        },
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

  async function updateResourceState(
    resource: ResourceProgressTarget,
    nextState: BlockState,
    action: "start" | "complete" | "difficult" | "skip",
    reflection: "easy" | "hard" | "useful" | "confusing" = "useful",
  ) {
    setBusyAction(`resource:${resource.id}:${action}`);

    try {
      await updateEntry(
        resource.id,
        nextState,
        {
          label: resource.title,
          blockTitle: resource.blockTitle,
        },
        "resource",
      );

      if (action === "start") {
        await recordEvent({
          type: LearningEventType.ResourceStarted,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
          },
        });
      }

      if (action === "complete") {
        await recordEvent({
          type: LearningEventType.ResourceCompleted,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
            reflection,
          },
        });
      }

      if (action === "difficult") {
        await recordEvent({
          type: LearningEventType.ResourceMarkedDifficult,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
            reason: `Needs another pass for ${resource.blockTitle.toLowerCase()}.`,
          },
        });
      }

      if (action === "skip") {
        await recordEvent({
          type: LearningEventType.ItemSkipped,
          payload: {
            itemId: resource.id,
            itemType: "resource",
            reason: `Skipped for now while working on ${resource.blockTitle.toLowerCase()}.`,
          },
        });
      }
    } finally {
      setBusyAction(null);
    }
  }

  return {
    entries,
    events,
    busyAction,
    isLoading: progressLoading || eventsLoading,
    updateBlockState,
    updateResourceState,
  } as const;
}
