"use client";

import { useState } from "react";

import type { DashboardBlock, DashboardContentState } from "@/entities/dashboard";
import { useDrafts } from "@/shared/hooks/use-drafts";
import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import { LearningEventType, type BlockState } from "@/shared/types";

import type {
  ResourceWithContext,
  WritingTaskWithContext,
} from "./dashboard-overview-types";
import {
  countActiveDays,
  getConsistencyLabel,
  getEntryState,
  getStrongestSkill,
  getWeakestSkill,
} from "./dashboard-overview-formatters";
import {
  buildDashboardCollections,
  getBestNextResource,
  getDailyPlan,
  getNeglectedAreas,
  getRecentActivity,
  getReviewPreviewItems,
  getWeakAreas,
  pickOutputPrompt,
  pickOutputTask,
  pickTodayOutput,
} from "./dashboard-overview-selectors";

export function useDashboardOverview(content: DashboardContentState) {
  const { entries, isLoading: progressLoading, updateEntry } = useLocalProgress();
  const { events, isLoading: eventsLoading, recordEvent } = useLearningEvents(8);
  const { drafts, isLoading: draftsLoading, createDraft } = useDrafts();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const collections = buildDashboardCollections(content);
  const blockProgressEntries = entries.filter((entry) => entry.entryType === "block");
  const resourceProgressEntries = entries.filter(
    (entry) => entry.entryType === "resource",
  );
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));

  const localStateLoading = progressLoading || eventsLoading || draftsLoading;

  const plan = getDailyPlan(collections, progressById, events);
  const focusBlock = plan.focusBlock;
  const totalPlanMinutes = plan.totalPlanMinutes;
  const planHeadline = plan.planHeadline;

  const focusBlockState = focusBlock
    ? getEntryState(progressById.get(focusBlock.id))
    : "not_started";

  const bestResource = getBestNextResource(
    collections,
    progressById,
    events,
    focusBlock?.id,
  );
  const focusResource = bestResource.resource;
  const recommendationReason = bestResource.reason;

  const reviewPreviewItems = getReviewPreviewItems(
    entries,
    events,
    collections.blockById,
    collections.resourceById,
  );
  const reviewHeadline =
    reviewPreviewItems.length > 0
      ? `${reviewPreviewItems.length} item${
          reviewPreviewItems.length === 1 ? "" : "s"
        } need attention`
      : "No urgent review yet";

  const weakAreas = getWeakAreas(
    entries,
    events,
    collections.allBlocks,
    collections.resources,
  );
  const neglectedAreas = getNeglectedAreas(
    events,
    collections.allBlocks,
    collections.resources,
  );

  const recentActivity = getRecentActivity(
    events,
    collections.blockById,
    collections.resourceById,
  );
  const completedBlocks = collections.allBlocks.filter(
    (block) => getEntryState(progressById.get(block.id)) === "completed",
  ).length;
  const roadmapCompletion = collections.allBlocks.length
    ? Math.round((completedBlocks / collections.allBlocks.length) * 100)
    : 0;
  const activeDaysThisWeek = countActiveDays(events, 7);
  const consistencyLabel = getConsistencyLabel(activeDaysThisWeek);
  const strongestSkill = getStrongestSkill(collections.allBlocks, collections.resources, entries);
  const weakestSkill = getWeakestSkill(
    collections.allBlocks,
    collections.resources,
    entries,
    events,
  );
  const nextWritingTask = pickOutputTask(collections.writingTasks, focusBlock?.id);
  const nextSpeakingPrompt = pickOutputPrompt(
    collections.speakingPrompts,
    focusBlock?.id,
  );
  const draftForWritingTask = nextWritingTask
    ? drafts.find((draft) => draft.taskId === nextWritingTask.id)
    : undefined;
  const outputFocus = pickTodayOutput(
    nextWritingTask,
    nextSpeakingPrompt,
    drafts.length > 0,
    events,
  );

  async function handleBlockStateChange(
    block: DashboardBlock,
    nextState: BlockState,
    action: "start" | "complete" | "review",
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
    } finally {
      setBusyAction(null);
    }
  }

  async function handleResourceStateChange(
    resource: ResourceWithContext,
    nextState: BlockState,
    action: "start" | "complete" | "difficult",
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
            reflection: "useful",
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
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateDraft(task: WritingTaskWithContext) {
    setBusyAction(`draft:${task.id}`);
    setDraftNotice(null);

    try {
      await createDraft(task.title, "", task.id);
      setDraftNotice(`Local draft stub created for "${task.title}".`);
    } catch {
      setDraftNotice("Draft creation failed. Try again from Practice.");
    } finally {
      setBusyAction(null);
    }
  }

  return {
    activeDaysThisWeek,
    allBlocks: collections.allBlocks,
    error,
    blockProgressCount: blockProgressEntries.length,
    busyAction,
    completedBlocks,
    consistencyLabel,
    draftForWritingTask,
    draftNotice,
    drafts,
    events,
    focusBlock,
    focusBlockState,
    focusResource,
    focusResourceEntry: focusResource
      ? progressById.get(focusResource.id)
      : undefined,
    localStateLoading,
    neglectedAreas,
    nextSpeakingPrompt,
    nextWritingTask,
    outputFocus,
    planHeadline,
    recentActivity,
    recommendationReason,
    resourceProgressCount: resourceProgressEntries.length,
    reviewHeadline,
    reviewPreviewItems,
    roadmapCompletion,
    strongestSkill,
    totalPlanMinutes,
    weakAreas,
    weakestSkill,
    handleBlockStateChange,
    handleCreateDraft,
    handleResourceStateChange,
  } as const;
}
