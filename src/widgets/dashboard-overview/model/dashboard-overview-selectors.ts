import type { DashboardBlock, DashboardContentState } from "@/entities/dashboard";
import {
  LearningEventType,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";

import {
  formatMinutes,
  getEntryState,
  getLatestEventTimestamp,
  isRecent,
  formatRelativeTimestamp,
} from "./dashboard-overview-formatters";
import type {
  ActivityItem,
  DashboardCollections,
  OutputFocus,
  ResourceWithContext,
  ReviewPreviewItem,
  SpeakingPromptWithContext,
  WeakAreaSignal,
  WritingTaskWithContext,
} from "./dashboard-overview-types";
import {
  generateDailyPlan,
  selectBestNextResource,
} from "@/server/recommendations/engine";
import {
  generateReviewQueue,
  detectWeakAreas,
  detectNeglectedSkills,
} from "@/server/review/queue";

export function buildDashboardCollections(
  content: DashboardContentState,
): DashboardCollections {
  const allBlocks = content.stages.flatMap((stage) => stage.blocks);
  const blockById = new Map(allBlocks.map((block) => [block.id, block]));

  const resources = allBlocks.flatMap((block) =>
    block.resources.map((resource) => ({
      ...resource,
      blockId: block.id,
      blockTitle: block.title,
      stageTitle: block.stageTitle,
      stageTypeLabel: block.stageTypeLabel,
      blockSkills: block.skills,
    })),
  );
  const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

  const writingTasks = allBlocks.flatMap((block) =>
    block.writingTasks.map((task) => ({
      ...task,
      blockId: block.id,
      stageTitle: block.stageTitle,
    })),
  );

  const speakingPrompts = allBlocks.flatMap((block) =>
    block.speakingPrompts.map((prompt) => ({
      ...prompt,
      blockId: block.id,
      stageTitle: block.stageTitle,
    })),
  );

  return {
    allBlocks,
    blockById,
    resourceById,
    resources,
    speakingPrompts,
    writingTasks,
  };
}

export function getFocusBlock(
  blocks: DashboardBlock[],
  progressById: Map<string, ProgressEntry>,
) {
  const incomplete = blocks.find((block) => {
    const state = getEntryState(progressById.get(block.id));
    return state !== "completed" && state !== "skipped_for_now";
  });

  // Return the first incomplete block, or null if all are done (all-done state)
  return incomplete ?? null;
}

export function pickFocusResource(
  resources: ResourceWithContext[],
  progressById: Map<string, ProgressEntry>,
) {
  if (resources.length === 0) {
    return null;
  }

  const activeResource = resources.find(
    (resource) => getEntryState(progressById.get(resource.id)) === "in_progress",
  );

  if (activeResource) {
    return activeResource;
  }

  const unfinishedCoreResource = resources.find((resource) => {
    const state = getEntryState(progressById.get(resource.id));
    return resource.role === "core" && state !== "completed";
  });

  return unfinishedCoreResource ?? resources[0];
}

export function pickOutputTask(
  tasks: WritingTaskWithContext[],
  focusBlockId: string | undefined,
) {
  return tasks.find((task) => task.blockId === focusBlockId) ?? tasks[0] ?? null;
}

export function pickOutputPrompt(
  prompts: SpeakingPromptWithContext[],
  focusBlockId: string | undefined,
) {
  return prompts.find((prompt) => prompt.blockId === focusBlockId) ?? prompts[0] ?? null;
}

export function pickTodayOutput(
  writingTask: WritingTaskWithContext | null,
  speakingPrompt: SpeakingPromptWithContext | null,
  hasDrafts: boolean,
  events: LearningEvent[],
): OutputFocus | null {
  const lastWritingAt = getLatestEventTimestamp(
    events,
    LearningEventType.WritingSubmitted,
  );
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );

  if (speakingPrompt && (!lastSpeakingAt || !isRecent(lastSpeakingAt, 5))) {
    return {
      kind: "speaking",
      title: speakingPrompt.title,
      detail: `${speakingPrompt.blockTitle} / ${formatMinutes(
        speakingPrompt.estimatedMinutes,
      )}`,
      estimatedMinutes: speakingPrompt.estimatedMinutes ?? 10,
      status: "speaking warm-up",
    };
  }

  if (writingTask && (hasDrafts || !lastWritingAt || !isRecent(lastWritingAt, 5))) {
    return {
      kind: "writing",
      title: writingTask.title,
      detail: `${writingTask.blockTitle} / ${formatMinutes(
        writingTask.estimatedMinutes,
      )}`,
      estimatedMinutes: writingTask.estimatedMinutes ?? 15,
      status: hasDrafts ? "resume draft" : "writing focus",
    };
  }

  if (speakingPrompt) {
    return {
      kind: "speaking",
      title: speakingPrompt.title,
      detail: `${speakingPrompt.blockTitle} / ${formatMinutes(
        speakingPrompt.estimatedMinutes,
      )}`,
      estimatedMinutes: speakingPrompt.estimatedMinutes ?? 10,
      status: "speaking practice",
    };
  }

  if (writingTask) {
    return {
      kind: "writing",
      title: writingTask.title,
      detail: `${writingTask.blockTitle} / ${formatMinutes(
        writingTask.estimatedMinutes,
      )}`,
      estimatedMinutes: writingTask.estimatedMinutes ?? 15,
      status: "writing focus",
    };
  }

  return null;
}

export function getReviewPreviewItems(
  entries: ProgressEntry[],
  events: LearningEvent[],
  blockById: Map<string, DashboardBlock>,
  resourceById: Map<string, ResourceWithContext>,
): ReviewPreviewItem[] {
  const queueItems = generateReviewQueue(entries, events, blockById, resourceById);

  return queueItems.slice(0, 4).map((item) => ({
    id: item.id,
    label: item.label,
    context: item.context,
    urgency: item.urgency,
    urgencyCategory: item.urgency,
  }));
}

export function getRecentActivity(
  events: LearningEvent[],
  blockById: Map<string, DashboardBlock>,
  resourceById: Map<string, ResourceWithContext>,
) {
  const items: ActivityItem[] = [];

  for (const event of events) {
    if (event.type === LearningEventType.BlockStarted) {
      const block = blockById.get(event.payload.blockId);
      items.push({
        id: event.id,
        title: `Started ${event.payload.blockLabel}`,
        detail:
          block?.stageTitle ?? "Local block activity is now shaping your dashboard.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.BlockCompleted) {
      const block = blockById.get(event.payload.blockId);
      items.push({
        id: event.id,
        title: `Completed ${event.payload.blockLabel}`,
        detail: block?.summary ?? "This block is now counted inside roadmap progress.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceStarted) {
      const resource = resourceById.get(event.payload.resourceId);
      items.push({
        id: event.id,
        title: `Started ${event.payload.resourceTitle}`,
        detail:
          resource?.blockTitle ?? "A support resource is now part of your current path.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceCompleted) {
      const resource = resourceById.get(event.payload.resourceId);
      items.push({
        id: event.id,
        title: `Completed ${event.payload.resourceTitle}`,
        detail:
          resource?.followUpHint ??
          "Use the follow-up hint or move into the next task while the material is fresh.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceMarkedDifficult) {
      items.push({
        id: event.id,
        title: `Flagged difficulty on ${event.payload.resourceTitle}`,
        detail: event.payload.reason ?? "This item will now appear in review preview.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.WritingSubmitted) {
      items.push({
        id: event.id,
        title: "Submitted a writing attempt",
        detail: `${event.payload.wordCount} words recorded locally.`,
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.SpeakingRecorded) {
      items.push({
        id: event.id,
        title: "Recorded a speaking session",
        detail: `${Math.round(event.payload.durationSeconds / 60)} min speaking warm-up.`,
        when: formatRelativeTimestamp(event.timestamp),
      });
    }
  }

  return items.slice(0, 5);
}

export function getDailyPlan(
  collections: DashboardCollections,
  progressById: Map<string, ProgressEntry>,
  events: LearningEvent[],
): {
  focusBlock: DashboardBlock | null;
  reviewItems: ReviewPreviewItem[];
  outputTask: OutputFocus | null;
  totalPlanMinutes: number;
  planHeadline: string;
} {
  return generateDailyPlan(collections, progressById, events);
}

export function getBestNextResource(
  collections: DashboardCollections,
  progressById: Map<string, ProgressEntry>,
  events: LearningEvent[],
  focusBlockId?: string,
): { resource: ResourceWithContext | null; reason: string; urgency: "now" | "soon" | "optional" } {
  return selectBestNextResource(collections, progressById, events, focusBlockId);
}

export function getWeakAreas(
  entries: ProgressEntry[],
  events: LearningEvent[],
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
): WeakAreaSignal[] {
  return detectWeakAreas(entries, events, blocks, resources);
}

export function getNeglectedAreas(
  events: LearningEvent[],
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
): WeakAreaSignal[] {
  return detectNeglectedSkills(events, blocks, resources);
}
