import {
  LearningEventType,
  type LearningEvent,
  type SpeakingRecordedEvent,
  type SpeakingReflection,
} from "@/shared/types";

import { countTranscriptWords } from "./speaking-session-helpers";

const HISTORY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type SpeakingHistoryEntry = {
  durationSeconds: number;
  hasTranscript: boolean;
  id: string;
  promptId?: string;
  promptTitle: string;
  reflection: SpeakingReflection | null;
  reflectionLabel: string | null;
  summary: string;
  timestamp: number;
  transcriptWordCount: number;
};

export type SpeakingHistorySnapshot = {
  detail: string;
  entries: SpeakingHistoryEntry[];
  headline: string;
  stats: {
    latestReflectionLabel: string | null;
    repeatedPromptCount: number;
    sessionsThisWeek: number;
    totalDurationSeconds: number;
    transcriptReadyCount: number;
  };
};

export function getSpeakingHistorySnapshot(
  events: LearningEvent[],
  promptTitleById: Map<string, string>,
  reflectionOptions: Array<{
    detail: string;
    label: string;
    value: SpeakingReflection;
  }>,
  now = Date.now(),
): SpeakingHistorySnapshot {
  const speakingEvents = events
    .filter(
      (event): event is SpeakingRecordedEvent =>
        event.type === LearningEventType.SpeakingRecorded,
    )
    .slice()
    .sort((left, right) => right.timestamp - left.timestamp);

  const entries = speakingEvents.slice(0, 4).map((event) => {
    const transcriptWordCount = countTranscriptWords(event.payload.transcript ?? "");
    const reflectionLabel =
      reflectionOptions.find((option) => option.value === event.payload.reflection)?.label ??
      null;

    return {
      durationSeconds: event.payload.durationSeconds,
      hasTranscript: transcriptWordCount > 0,
      id: event.id,
      promptId: event.payload.promptId,
      promptTitle: event.payload.promptId
        ? promptTitleById.get(event.payload.promptId) ?? "Speaking return"
        : "Speaking return",
      reflection: event.payload.reflection ?? null,
      reflectionLabel,
      summary: getSpeakingEntrySummary(transcriptWordCount, reflectionLabel),
      timestamp: event.timestamp,
      transcriptWordCount,
    } satisfies SpeakingHistoryEntry;
  });

  const sessionsThisWeek = speakingEvents.filter(
    (event) => now - event.timestamp <= HISTORY_WINDOW_MS,
  ).length;
  const transcriptReadyCount = speakingEvents.filter((event) =>
    Boolean(event.payload.transcript?.trim()),
  ).length;
  const totalDurationSeconds = speakingEvents.reduce(
    (sum, event) => sum + event.payload.durationSeconds,
    0,
  );
  const latestReflectionLabel =
    entries.find((entry) => entry.reflectionLabel)?.reflectionLabel ?? null;
  const repeatedPromptCount = getRepeatedPromptCount(speakingEvents);

  return {
    detail: getSpeakingHistoryDetail(
      speakingEvents.length,
      transcriptReadyCount,
      repeatedPromptCount,
      latestReflectionLabel,
    ),
    entries,
    headline: getSpeakingHistoryHeadline(speakingEvents.length, sessionsThisWeek),
    stats: {
      latestReflectionLabel,
      repeatedPromptCount,
      sessionsThisWeek,
      totalDurationSeconds,
      transcriptReadyCount,
    },
  };
}

function getSpeakingEntrySummary(
  transcriptWordCount: number,
  reflectionLabel: string | null,
) {
  if (transcriptWordCount > 0 && reflectionLabel) {
    return `${transcriptWordCount} transcript words captured locally with a ${reflectionLabel.toLowerCase()} reflection.`;
  }

  if (transcriptWordCount > 0) {
    return `${transcriptWordCount} transcript words captured locally for future review.`;
  }

  if (reflectionLabel) {
    return `${reflectionLabel} reflection saved locally for the next return.`;
  }

  return "Saved locally without a transcript or reflection note.";
}

function getSpeakingHistoryHeadline(
  totalSessions: number,
  sessionsThisWeek: number,
) {
  if (sessionsThisWeek > 0) {
    return `${sessionsThisWeek} speaking return${sessionsThisWeek === 1 ? "" : "s"} this week`;
  }

  if (totalSessions > 0) {
    return `${totalSessions} saved speaking return${totalSessions === 1 ? "" : "s"} so far`;
  }

  return "No speaking history yet";
}

function getSpeakingHistoryDetail(
  totalSessions: number,
  transcriptReadyCount: number,
  repeatedPromptCount: number,
  latestReflectionLabel: string | null,
) {
  if (totalSessions === 0) {
    return "Record one short speaking return to start building visible local continuity in this browser.";
  }

  if (latestReflectionLabel) {
    return `Latest confidence signal: ${latestReflectionLabel}.`;
  }

  if (transcriptReadyCount > 0) {
    return `${transcriptReadyCount} transcript-ready return${transcriptReadyCount === 1 ? "" : "s"} are already saved locally.`;
  }

  if (repeatedPromptCount > 0) {
    return `${repeatedPromptCount} prompt${repeatedPromptCount === 1 ? "" : "s"} have been repeated, which helps speaking continuity.`;
  }

  return "Short saved speaking returns are starting to build confidence and continuity.";
}

function getRepeatedPromptCount(events: SpeakingRecordedEvent[]) {
  const counts = new Map<string, number>();

  for (const event of events) {
    if (!event.payload.promptId) {
      continue;
    }

    counts.set(event.payload.promptId, (counts.get(event.payload.promptId) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > 1).length;
}
