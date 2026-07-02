import {
  type ActiveSpeakingSession,
  speakingReflectionValues,
} from "@/shared/types";

const STORAGE_KEY = "english-os:active-speaking-session";

/**
 * Read the current active speaking session from localStorage.
 */
export function getActiveSpeakingSession(): ActiveSpeakingSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<ActiveSpeakingSession>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.promptId !== "string" ||
      typeof parsed.promptTitle !== "string" ||
      typeof parsed.createdAt !== "number" ||
      typeof parsed.elapsedSeconds !== "number" ||
      typeof parsed.updatedAt !== "number" ||
      (parsed.lastResumedAt !== null && typeof parsed.lastResumedAt !== "number") ||
      !isSessionStatus(parsed.status)
    ) {
      return null;
    }

    return {
      createdAt: parsed.createdAt,
      elapsedSeconds: parsed.elapsedSeconds,
      id: parsed.id,
      lastResumedAt: parsed.lastResumedAt ?? null,
      promptId: parsed.promptId,
      promptTitle: parsed.promptTitle,
      reflection: isReflection(parsed.reflection) ? parsed.reflection : null,
      status: parsed.status,
      transcriptDraft:
        typeof parsed.transcriptDraft === "string" ? parsed.transcriptDraft : "",
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Persist the current active speaking session to localStorage.
 */
export function setActiveSpeakingSession(session: ActiveSpeakingSession): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be full or unavailable - silently ignore
  }
}

/**
 * Remove the current active speaking session from localStorage.
 */
export function clearActiveSpeakingSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}

function isSessionStatus(
  status: ActiveSpeakingSession["status"] | undefined,
): status is ActiveSpeakingSession["status"] {
  return status === "active" || status === "paused" || status === "reflecting";
}

function isReflection(
  reflection: string | null | undefined,
): reflection is ActiveSpeakingSession["reflection"] {
  return (
    reflection != null &&
    speakingReflectionValues.includes(reflection as (typeof speakingReflectionValues)[number])
  );
}
