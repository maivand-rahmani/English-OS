import type { DashboardBlock, DashboardContentState } from "@/entities/dashboard";
import {
  LearningEventType,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";
import {
  buildDashboardCollections,
  getFocusBlock,
} from "@/widgets/dashboard-overview/model/dashboard-overview-selectors";
import type { SpeakingPromptWithContext } from "@/widgets/dashboard-overview/model/dashboard-overview-types";

export type SpeakingPromptListItem = SpeakingPromptWithContext & {
  isActive: boolean;
  isRecommended: boolean;
  lastRecordedAt: number | null;
};

export type SpeakingWorkspaceState = {
  activePrompt: SpeakingPromptWithContext | null;
  focusBlock: DashboardBlock | null;
  prompts: SpeakingPromptListItem[];
};

export function getPreferredSpeakingPrompt(
  prompts: SpeakingPromptWithContext[],
  focusBlockId: string | undefined,
  events: LearningEvent[],
) {
  const lastRecordedByPromptId = getLatestPromptRecordings(events);

  return (
    prompts.find(
      (prompt) =>
        prompt.blockId === focusBlockId && lastRecordedByPromptId.has(prompt.id),
    ) ??
    prompts.find((prompt) => lastRecordedByPromptId.has(prompt.id)) ??
    prompts.find((prompt) => prompt.blockId === focusBlockId) ??
    prompts[0] ??
    null
  );
}

export function getSpeakingWorkspaceState(
  content: DashboardContentState,
  entries: ProgressEntry[],
  events: LearningEvent[],
  selectedPromptId?: string | null,
): SpeakingWorkspaceState {
  const collections = buildDashboardCollections(content);
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const focusBlock = getFocusBlock(collections.allBlocks, progressById);
  const preferredPrompt = getPreferredSpeakingPrompt(
    collections.speakingPrompts,
    focusBlock?.id,
    events,
  );
  const activePrompt =
    collections.speakingPrompts.find((prompt) => prompt.id === selectedPromptId) ??
    preferredPrompt;
  const lastRecordedByPromptId = getLatestPromptRecordings(events);

  const prompts = collections.speakingPrompts
    .map((prompt, index) => ({
      ...prompt,
      isActive: prompt.id === activePrompt?.id,
      isRecommended: prompt.blockId === focusBlock?.id,
      lastRecordedAt: lastRecordedByPromptId.get(prompt.id) ?? null,
      order: index,
    }))
    .sort((left, right) => comparePromptPriority(left, right))
    .map((prompt) => {
      const { order, ...promptListItem } = prompt;
      void order;
      return promptListItem;
    });

  return {
    activePrompt,
    focusBlock,
    prompts,
  };
}

function getLatestPromptRecordings(events: LearningEvent[]) {
  const lastRecordedByPromptId = new Map<string, number>();

  for (const event of events) {
    if (event.type !== LearningEventType.SpeakingRecorded || !event.payload.promptId) {
      continue;
    }

    const currentTimestamp = lastRecordedByPromptId.get(event.payload.promptId) ?? 0;

    if (event.timestamp > currentTimestamp) {
      lastRecordedByPromptId.set(event.payload.promptId, event.timestamp);
    }
  }

  return lastRecordedByPromptId;
}

function comparePromptPriority(
  left: SpeakingPromptListItem & { order: number },
  right: SpeakingPromptListItem & { order: number },
) {
  const scoreDiff = getPromptPriority(right) - getPromptPriority(left);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return left.order - right.order;
}

function getPromptPriority(prompt: SpeakingPromptListItem) {
  if (prompt.isActive) {
    return 3;
  }

  if (prompt.lastRecordedAt) {
    return 2;
  }

  if (prompt.isRecommended) {
    return 1;
  }

  return 0;
}
