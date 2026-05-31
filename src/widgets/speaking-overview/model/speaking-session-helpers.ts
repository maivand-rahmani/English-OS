import type { ActiveSpeakingSession, SpeakingReflection } from "@/shared/types";

export const speakingReflectionOptions: Array<{
  detail: string;
  label: string;
  value: SpeakingReflection;
}> = [
  {
    value: "felt_easy",
    label: "Felt easy",
    detail: "The prompt felt comfortable and the ideas came out smoothly.",
  },
  {
    value: "felt_difficult",
    label: "Felt difficult",
    detail: "The answer was possible, but the whole response felt heavy.",
  },
  {
    value: "did_not_know_what_to_say",
    label: "Ideas were missing",
    detail: "The hard part was finding enough to say, not only the English.",
  },
  {
    value: "vocabulary_missing",
    label: "Vocabulary missing",
    detail: "You had the idea, but key words were hard to find.",
  },
  {
    value: "grammar_felt_unstable",
    label: "Grammar felt unstable",
    detail: "The answer moved, but sentence control still felt shaky.",
  },
  {
    value: "want_to_repeat_this_prompt",
    label: "Want to repeat",
    detail: "This prompt is worth another try while it is still fresh.",
  },
];

export function getSpeakingSessionElapsed(
  session: ActiveSpeakingSession | null | undefined,
  now = Date.now(),
) {
  if (!session) {
    return 0;
  }

  if (session.status !== "active" || session.lastResumedAt == null) {
    return session.elapsedSeconds;
  }

  return session.elapsedSeconds + Math.max(0, Math.floor((now - session.lastResumedAt) / 1000));
}

export function formatSpeakingDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export function countTranscriptWords(transcript: string) {
  return transcript.trim().split(/\s+/).filter(Boolean).length;
}

export function getSpeakingSessionSummary(
  session: ActiveSpeakingSession | null | undefined,
  elapsedSeconds: number,
) {
  if (!session) {
    return {
      detail: "Start one speaking return to track time, pause if needed, then save a short reflection.",
      label: "No active session",
    };
  }

  if (session.status === "active") {
    return {
      detail: "Speak out loud now. Pause if you need a breath, then finish when the answer feels complete enough.",
      label: `Speaking live for ${formatSpeakingDuration(elapsedSeconds)}`,
    };
  }

  if (session.status === "paused") {
    return {
      detail: "Your time is saved locally. Resume when you are ready or finish the session from here.",
      label: `Paused at ${formatSpeakingDuration(elapsedSeconds)}`,
    };
  }

  return {
    detail:
      session.reflection != null
        ? session.transcriptDraft.trim()
          ? "Reflection and transcript are captured. Save the session to record this speaking return locally."
          : "Reflection is captured. Add a rough transcript or save the session when you are ready."
        : "Pick one reflection note before saving the session.",
    label: `Reflection ready at ${formatSpeakingDuration(elapsedSeconds)}`,
  };
}

export function getReflectionLabel(reflection: SpeakingReflection | null | undefined) {
  return (
    speakingReflectionOptions.find((option) => option.value === reflection)?.label ?? null
  );
}

export function getTranscriptSummary(transcript: string) {
  const trimmedTranscript = transcript.trim();
  const wordCount = countTranscriptWords(trimmedTranscript);

  if (!trimmedTranscript) {
    return {
      detail:
        "Add a rough transcript after speaking so future transcript-based feedback has a clean place to start.",
      label: "No transcript yet",
      wordCount: 0,
    };
  }

  if (wordCount < 12) {
    return {
      detail:
        "Even a rough transcript is useful. Add one or two more lines if the answer was longer than this.",
      label: "Short transcript draft",
      wordCount,
    };
  }

  return {
    detail:
      "This transcript is ready for a future clarity and feedback pass, even if it is not perfectly edited.",
    label: "Transcript draft ready",
    wordCount,
  };
}

export function getTranscriptPreview(transcript: string, maxWords = 24) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return null;
  }

  if (words.length <= maxWords) {
    return words.join(" ");
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}
