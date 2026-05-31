export const speakingReflectionValues = [
  "felt_easy",
  "felt_difficult",
  "did_not_know_what_to_say",
  "vocabulary_missing",
  "grammar_felt_unstable",
  "want_to_repeat_this_prompt",
] as const;

export type SpeakingReflection = (typeof speakingReflectionValues)[number];

export type ActiveSpeakingSessionStatus = "active" | "paused" | "reflecting";

/**
 * Local-first speaking session state persisted in localStorage so short
 * mobile interruptions can resume the current prompt flow.
 */
export type ActiveSpeakingSession = {
  createdAt: number;
  elapsedSeconds: number;
  id: string;
  lastResumedAt: number | null;
  promptId: string;
  promptTitle: string;
  reflection: SpeakingReflection | null;
  status: ActiveSpeakingSessionStatus;
  transcriptDraft: string;
  updatedAt: number;
};
