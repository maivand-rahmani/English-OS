import {
  LearningEventType,
  type DraftSummary,
  type LearningEvent,
  type WritingSubmittedEvent,
} from "@/shared/types";

const HISTORY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type WritingHistoryEntry = {
  id: string;
  lastSubmittedAt: number | null;
  lastWordCount: number | null;
  revisionPending: boolean;
  statusLabel: string;
  summary: string;
  submissionCount: number;
  taskId?: string;
  timestamp: number;
  title: string;
};

export type WritingHistorySnapshot = {
  detail: string;
  entries: WritingHistoryEntry[];
  headline: string;
  latestSubmittedAt: number | null;
  latestWordCount: number | null;
  stats: {
    draftsInProgress: number;
    revisionsInProgress: number;
    submissionsThisWeek: number;
  };
};

export function getWritingHistorySnapshot(
  drafts: DraftSummary[],
  events: LearningEvent[],
  now = Date.now(),
): WritingHistorySnapshot {
  const writingEvents = events
    .filter(
      (event): event is WritingSubmittedEvent =>
        event.type === LearningEventType.WritingSubmitted,
    )
    .slice()
    .sort((left, right) => right.timestamp - left.timestamp);

  const submissionsThisWeek = writingEvents.filter(
    (event) => now - event.timestamp <= HISTORY_WINDOW_MS,
  ).length;
  const draftsInProgress = drafts.filter(
    (draft) => !draft.lastSubmittedAt || draft.updatedAt > draft.lastSubmittedAt,
  ).length;
  const revisionsInProgress = drafts.filter(
    (draft) => draft.lastSubmittedAt && draft.updatedAt > draft.lastSubmittedAt,
  ).length;

  const entries = drafts
    .map((draft) => {
      const lastSubmittedAt = draft.lastSubmittedAt ?? null;
      const revisionPending =
        lastSubmittedAt != null && draft.updatedAt > lastSubmittedAt;
      const timestamp = revisionPending
        ? draft.updatedAt
        : lastSubmittedAt ?? draft.updatedAt;
      const submissionCount = draft.submissionCount ?? 0;
      const lastWordCount = draft.lastWordCount ?? null;

      return {
        id: draft.id,
        lastSubmittedAt,
        lastWordCount,
        revisionPending,
        statusLabel: getWritingEntryStatusLabel(lastSubmittedAt, revisionPending, submissionCount),
        summary: getWritingEntrySummary(lastSubmittedAt, lastWordCount, revisionPending),
        submissionCount,
        taskId: draft.taskId,
        timestamp,
        title: draft.title,
      } satisfies WritingHistoryEntry;
    })
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 4);

  const latestSubmittedAt =
    entries.find((entry) => entry.lastSubmittedAt != null)?.lastSubmittedAt ??
    writingEvents[0]?.timestamp ??
    null;
  const latestWordCount =
    entries.find((entry) => entry.lastWordCount != null)?.lastWordCount ??
    writingEvents[0]?.payload.wordCount ??
    null;

  return {
    detail: getWritingHistoryDetail(drafts.length, submissionsThisWeek, revisionsInProgress),
    entries,
    headline: getWritingHistoryHeadline(drafts.length, submissionsThisWeek),
    latestSubmittedAt,
    latestWordCount,
    stats: {
      draftsInProgress,
      revisionsInProgress,
      submissionsThisWeek,
    },
  };
}

function getWritingEntryStatusLabel(
  lastSubmittedAt: number | null,
  revisionPending: boolean,
  submissionCount: number,
) {
  if (lastSubmittedAt == null) {
    return "Draft in progress";
  }

  if (revisionPending) {
    return "Revision in progress";
  }

  if (submissionCount > 1) {
    return `Submitted ${submissionCount} times`;
  }

  return "Submitted once";
}

function getWritingEntrySummary(
  lastSubmittedAt: number | null,
  lastWordCount: number | null,
  revisionPending: boolean,
) {
  if (lastSubmittedAt == null) {
    return "Saved locally and still waiting for a first submitted attempt.";
  }

  const wordCountLabel =
    lastWordCount != null
      ? `${lastWordCount} words in the latest submitted attempt.`
      : "Latest submitted attempt saved locally.";

  if (revisionPending) {
    return `${wordCountLabel} Draft edits continued after that submission.`;
  }

  return `${wordCountLabel} Ready to reopen or revise any time.`;
}

function getWritingHistoryHeadline(
  draftCount: number,
  submissionsThisWeek: number,
) {
  if (submissionsThisWeek > 0) {
    return `${submissionsThisWeek} writing submission${submissionsThisWeek === 1 ? "" : "s"} this week`;
  }

  if (draftCount > 0) {
    return `${draftCount} local draft${draftCount === 1 ? "" : "s"} building momentum`;
  }

  return "No writing history yet";
}

function getWritingHistoryDetail(
  draftCount: number,
  submissionsThisWeek: number,
  revisionsInProgress: number,
) {
  if (submissionsThisWeek > 0) {
    return revisionsInProgress > 0
      ? revisionsInProgress === 1
        ? "1 revision loop is still open locally."
        : `${revisionsInProgress} revision loops are still open locally.`
      : "Writing attempts are starting to accumulate into visible local history.";
  }

  if (draftCount > 0) {
    return "Submit one attempt to turn the draft stack into visible writing history.";
  }

  return "Start one draft and submit the first attempt to build local writing history in this browser.";
}
