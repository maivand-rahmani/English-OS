import type { DashboardBlock, DashboardResource, DashboardSkill, DashboardSpeakingPrompt, DashboardWritingTask } from "@/entities/dashboard";
import {
  LearningEventType,
  type BlockState,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";
import {
  formatMinutes,
  getEntryState,
  getLatestEventTimestamp,
} from "@/shared/lib/recommendation-helpers";
import {
  generateReviewQueue,
  type EnrichedResource as ReviewEnrichedResource,
} from "@/server/review/queue";

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export type EnrichedResource = DashboardResource & {
  blockId: string;
  blockTitle: string;
  stageTitle: string;
  stageTypeLabel: string;
  blockSkills: DashboardSkill[];
};

export type EnrichedWritingTask = DashboardWritingTask & {
  blockId: string;
  stageTitle: string;
};

export type EnrichedSpeakingPrompt = DashboardSpeakingPrompt & {
  blockId: string;
  stageTitle: string;
};

export type OutputFocus = {
  kind: "writing" | "speaking";
  title: string;
  detail: string;
  estimatedMinutes: number;
  status: string;
};

export type ReviewPreviewItem = {
  id: string;
  label: string;
  context: string;
  urgency: string;
};

export type DailyPlan = {
  focusBlock: DashboardBlock | null;
  reviewItems: ReviewPreviewItem[];
  outputTask: OutputFocus | null;
  totalPlanMinutes: number;
  planHeadline: string;
};

export type BestNextResource = {
  resource: EnrichedResource | null;
  reason: string;
  urgency: "now" | "soon" | "optional";
};

export type DailyPlanOptions = {
  maxReviewItems?: number;
};

export type RecommendationContext = {
  blockState: BlockState;
  resourceState: BlockState;
  events: LearningEvent[];
};

/* ------------------------------------------------------------------ */
/*  Collection type (server-side convenience)                          */
/* ------------------------------------------------------------------ */

export type RecommendationCollections = {
  allBlocks: DashboardBlock[];
  blockById: Map<string, DashboardBlock>;
  resourceById: Map<string, EnrichedResource>;
  resources: EnrichedResource[];
  speakingPrompts: EnrichedSpeakingPrompt[];
  writingTasks: EnrichedWritingTask[];
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_MAX_REVIEW = 3;
const REVIEW_ITEM_MINUTES = 5;
const REVIEW_MAX_MINUTES = 15;

/* ------------------------------------------------------------------ */
/*  selectBestNextResource                                             */
/* ------------------------------------------------------------------ */

export function selectBestNextResource(
  collections: RecommendationCollections,
  progressById: Map<string, ProgressEntry>,
  events: LearningEvent[],
  focusBlockId?: string,
  focusStageId?: string,
): BestNextResource {
  const { resources } = collections;

  // Compute the set of block IDs that belong to the focus stage and the
  // immediate next stage. When no focus is provided, no constraint is applied
  // and the function behaves as before.
  const stageScopedBlockIds = computeStageScopedBlockIds(
    collections,
    focusBlockId,
    focusStageId,
  );

  const stageResources = stageScopedBlockIds
    ? resources.filter((r) => stageScopedBlockIds.has(r.blockId))
    : resources;

  const focusResources = focusBlockId
    ? resources.filter((r) => r.blockId === focusBlockId)
    : stageResources;

  const noResourceResult: BestNextResource = {
    resource: null,
    reason: "No resources available yet.",
    urgency: "optional",
  };

  // 1. Active / in-progress resources
  const active = focusResources.find(
    (r) => getEntryState(progressById.get(r.id)) === "in_progress",
  );
  if (active) {
    return {
      resource: active,
      reason: generateRecommendationReason(active, {
        blockState: getEntryState(progressById.get(active.blockId)),
        resourceState: "in_progress",
        events,
      }),
      urgency: "now",
    };
  }

  // 2. Core resources not completed (in focus block)
  const unfinishedCore = focusResources.find(
    (r) => r.role === "core" && getEntryState(progressById.get(r.id)) !== "completed",
  );
  if (unfinishedCore) {
    return {
      resource: unfinishedCore,
      reason: generateRecommendationReason(unfinishedCore, {
        blockState: getEntryState(progressById.get(unfinishedCore.blockId)),
        resourceState: getEntryState(progressById.get(unfinishedCore.id)),
        events,
      }),
      urgency: "soon",
    };
  }

  // 3. Supporting resources (in focus block)
  const supporting = focusResources.find(
    (r) =>
      r.role === "supporting" && getEntryState(progressById.get(r.id)) !== "completed",
  );
  if (supporting) {
    return {
      resource: supporting,
      reason: generateRecommendationReason(supporting, {
        blockState: getEntryState(progressById.get(supporting.blockId)),
        resourceState: getEntryState(progressById.get(supporting.id)),
        events,
      }),
      urgency: "soon",
    };
  }

  // 4. Any unfinished core resource within current + next stage
  const anyCore = stageResources.find(
    (r) => r.role === "core" && getEntryState(progressById.get(r.id)) !== "completed",
  );
  if (anyCore) {
    return {
      resource: anyCore,
      reason: generateRecommendationReason(anyCore, {
        blockState: getEntryState(progressById.get(anyCore.blockId)),
        resourceState: getEntryState(progressById.get(anyCore.id)),
        events,
      }),
      urgency: "optional",
    };
  }

  // 5. Fallback to first resource within current + next stage
  const first = stageResources[0];
  if (first) {
    return {
      resource: first,
      reason: first.whyRecommended || "A good next step in your learning journey.",
      urgency: "optional",
    };
  }

  return noResourceResult;
}

/**
 * Build the set of block IDs that should be considered when recommending a
 * next resource. When both `focusBlockId` and `focusStageId` are provided,
 * the result includes all blocks in the focus stage plus all blocks in the
 * next stage that immediately follows it in the `allBlocks` ordering.
 *
 * Returns `null` when no focus is provided, which signals "no constraint".
 */
function computeStageScopedBlockIds(
  collections: RecommendationCollections,
  focusBlockId: string | undefined,
  focusStageId: string | undefined,
): Set<string> | null {
  if (!focusBlockId && !focusStageId) {
    return null;
  }

  const blockIds = new Set<string>();
  const { allBlocks } = collections;

  // Resolve the focus stage. Prefer the explicit param, otherwise derive it
  // from the focus block.
  let resolvedFocusStageId = focusStageId;
  if (!resolvedFocusStageId && focusBlockId) {
    const focusBlock = collections.blockById.get(focusBlockId);
    if (focusBlock) {
      resolvedFocusStageId = focusBlock.stageId;
    }
  }

  if (!resolvedFocusStageId) {
    return null;
  }

  // Add every block in the focus stage.
  for (const block of allBlocks) {
    if (block.stageId === resolvedFocusStageId) {
      blockIds.add(block.id);
    }
  }

  // Add every block in the very next stage that follows in the array order.
  const focusStageStartIndex = allBlocks.findIndex(
    (b) => b.stageId === resolvedFocusStageId,
  );
  if (focusStageStartIndex >= 0) {
    let nextStageId: string | null = null;
    for (let i = focusStageStartIndex + 1; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      if (block.stageId !== resolvedFocusStageId) {
        nextStageId = block.stageId;
        break;
      }
    }
    if (nextStageId !== null) {
      for (const block of allBlocks) {
        if (block.stageId === nextStageId) {
          blockIds.add(block.id);
        }
      }
    }
  }

  return blockIds;
}

/* ------------------------------------------------------------------ */
/*  generateRecommendationReason                                       */
/* ------------------------------------------------------------------ */

export function generateRecommendationReason(
  resource: EnrichedResource,
  context: RecommendationContext,
): string {
  const { blockState, resourceState, events } = context;
  const blockLabel = resource.blockTitle.toLowerCase();

  if (resourceState === "needs_review" || resourceState === "difficult") {
    const hasDifficultyEvent = events.some(
      (e) =>
        e.type === LearningEventType.ResourceMarkedDifficult &&
        e.payload.resourceId === resource.id,
    );
    if (hasDifficultyEvent) {
      return `Recommended because you marked the last related item difficult for ${blockLabel}.`;
    }
    return `Recommended because you marked this resource as needing review for ${blockLabel}.`;
  }

  if (resourceState === "in_progress") {
    return `Recommended because it's already part of your active work inside ${blockLabel}.`;
  }

  if (blockState !== "completed" && resource.role === "core") {
    return `Recommended because this is the core support resource for your current step in ${resource.stageTitle.toLowerCase()}.`;
  }

  const hasAnyRecent = events.some(
    (e) => e.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000,
  );
  const neglectedSkill = !hasAnyRecent
    ? resource.blockSkills.find((s) => s.emphasis === "primary")
    : undefined;

  if (neglectedSkill) {
    return `Recommended because ${neglectedSkill.title} has been neglected this week.`;
  }

  return resource.whyRecommended || `Continue with ${resource.title} for ${blockLabel}.`;
}

/* ------------------------------------------------------------------ */
/*  generateDailyPlan                                                  */
/* ------------------------------------------------------------------ */

export function generateDailyPlan(
  collections: RecommendationCollections,
  progressById: Map<string, ProgressEntry>,
  events: LearningEvent[],
  options?: DailyPlanOptions,
): DailyPlan {
  const maxReviewItems = options?.maxReviewItems ?? DEFAULT_MAX_REVIEW;

  const focusBlock = getFocusBlock(collections.allBlocks, progressById);

  const entries = [...progressById.values()];
  const fullQueue = generateReviewQueue(
    entries,
    events,
    collections.blockById,
    collections.resourceById as Map<string, ReviewEnrichedResource>,
  );
  const urgentReviewItems = fullQueue
    .filter(
      (item) => item.urgency === "overdue" || item.urgency === "due_soon",
    )
    .slice(0, maxReviewItems);

  const reviewItems: ReviewPreviewItem[] = urgentReviewItems.map((item) => ({
    id: item.id,
    label: item.label,
    context: item.context,
    urgency: item.urgency,
  }));

  const outputTask = pickLeastRecentOutput(collections, events);
  const totalPlanMinutes = computeTotalMinutes(focusBlock, reviewItems, outputTask);
  const planHeadline = generatePlanHeadline(focusBlock, reviewItems, outputTask);

  return {
    focusBlock,
    reviewItems,
    outputTask,
    totalPlanMinutes,
    planHeadline,
  };
}

/* ------------------------------------------------------------------ */
/*  computeRecommendedStack                                            */
/* ------------------------------------------------------------------ */

export function computeRecommendedStack(
  collections: RecommendationCollections,
  progressById: Map<string, ProgressEntry>,
  events: LearningEvent[],
): {
  focusBlock: DashboardBlock | null;
  focusResource: BestNextResource;
  reviewItems: ReviewPreviewItem[];
  outputTask: OutputFocus | null;
} {
  const focusBlock = getFocusBlock(collections.allBlocks, progressById);
  const focusResource = selectBestNextResource(
    collections,
    progressById,
    events,
    focusBlock?.id,
  );
  const outputTask = pickLeastRecentOutput(collections, events);

  const entries = [...progressById.values()];
  const fullQueue = generateReviewQueue(
    entries,
    events,
    collections.blockById,
    collections.resourceById as Map<string, ReviewEnrichedResource>,
  );
  const relevantReviewItems = focusBlock
    ? fullQueue
        .filter(
          (item) =>
            item.context.includes(focusBlock.stageTitle) ||
            item.context.includes(focusBlock.title),
        )
        .slice(0, 3)
    : [];

  const reviewItems: ReviewPreviewItem[] =
    relevantReviewItems.length > 0
      ? relevantReviewItems.map((item) => ({
          id: item.id,
          label: item.label,
          context: item.context,
          urgency: item.urgency,
        }))
      : fullQueue.slice(0, 2).map((item) => ({
          id: item.id,
          label: item.label,
          context: item.context,
          urgency: item.urgency,
        }));

  return { focusBlock, focusResource, reviewItems, outputTask };
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

function getFocusBlock(
  blocks: DashboardBlock[],
  progressById: Map<string, ProgressEntry>,
): DashboardBlock | null {
  const incomplete = blocks.find((block) => {
    const state = getEntryState(progressById.get(block.id));
    return state !== "completed" && state !== "skipped_for_now";
  });
  return incomplete ?? null;
}

function pickLeastRecentOutput(
  collections: RecommendationCollections,
  events: LearningEvent[],
): OutputFocus | null {
  const { writingTasks, speakingPrompts } = collections;
  const lastWritingAt = getLatestEventTimestamp(
    events,
    LearningEventType.WritingSubmitted,
  );
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );

  const writingNeeded =
    !lastWritingAt ||
    (lastSpeakingAt !== null && lastWritingAt < lastSpeakingAt);

  if (writingNeeded && writingTasks.length > 0) {
    const task = writingTasks[0];
    return {
      kind: "writing",
      title: task.title,
      detail: `${task.blockTitle} / ${formatMinutes(task.estimatedMinutes)}`,
      estimatedMinutes: task.estimatedMinutes ?? 15,
      status: "writing focus",
    };
  }

  if (speakingPrompts.length > 0) {
    const prompt = speakingPrompts[0];
    return {
      kind: "speaking",
      title: prompt.title,
      detail: `${prompt.blockTitle} / ${formatMinutes(prompt.estimatedMinutes)}`,
      estimatedMinutes: prompt.estimatedMinutes ?? 10,
      status: "speaking practice",
    };
  }

  if (writingTasks.length > 0) {
    const task = writingTasks[0];
    return {
      kind: "writing",
      title: task.title,
      detail: `${task.blockTitle} / ${formatMinutes(task.estimatedMinutes)}`,
      estimatedMinutes: task.estimatedMinutes ?? 15,
      status: "writing focus",
    };
  }

  return null;
}

function computeTotalMinutes(
  focusBlock: DashboardBlock | null,
  reviewItems: ReviewPreviewItem[],
  outputTask: OutputFocus | null,
): number {
  const blockMinutes = focusBlock?.estimatedMinutes ?? 0;
  const reviewMinutes =
    reviewItems.length > 0
      ? Math.min(REVIEW_MAX_MINUTES, reviewItems.length * REVIEW_ITEM_MINUTES)
      : 0;
  const outputMinutes = outputTask?.estimatedMinutes ?? 0;
  return blockMinutes + reviewMinutes + outputMinutes;
}

function generatePlanHeadline(
  focusBlock: DashboardBlock | null,
  reviewItems: ReviewPreviewItem[],
  outputTask: OutputFocus | null,
): string {
  if (focusBlock) {
    const base = `Keep moving through ${focusBlock.stageTitle.toLowerCase()}.`;
    const extras: string[] = [];
    if (reviewItems.length > 0) extras.push(`${reviewItems.length} review item${reviewItems.length === 1 ? "" : "s"}`);
    if (outputTask) {
      const label = outputTask.kind === "writing" ? "a writing task" : "a speaking warm-up";
      extras.push(label);
    }
    return extras.length > 0 ? `${base} Includes ${extras.join(" and ")}.` : base;
  }

  if (reviewItems.length > 0) {
    return "Time to review and reinforce past material.";
  }

  return "Curated content will land here once the roadmap is available.";
}
