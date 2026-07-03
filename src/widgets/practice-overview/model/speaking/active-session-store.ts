/**
 * Active Speaking Session Store
 *
 * Zustand store backed by localStorage for the currently active speaking
 * session in `use-speaking-workspace`. Replaces the synchronous
 * `getActiveSpeakingSession` / `setActiveSpeakingSession` / `clearActiveSpeakingSession`
 * helpers that previously lived in the legacy persistence layer.
 *
 * **Why a store?** The original localStorage helpers were stateless — every
 * call re-read from disk and React re-renders couldn't observe writes. The
 * store keeps the session in memory so subscribers update automatically.
 *
 * **Persistence key:** `english-os:active-speaking-session` — MUST match the
 * legacy key exactly so the migration is a drop-in replacement.
 *
 * **SSR safety:** `createJSONStorage` is gated by `typeof window` to avoid
 * `localStorage is not defined` during Next.js SSR.
 *
 * @module active-session-store
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  type ActiveSpeakingSession,
  speakingReflectionValues,
} from "@/shared/types";

/**
 * Noop storage for SSR environments where `localStorage` is unavailable.
 * Satisfies the `StateStorage` interface without throwing.
 */
const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  // Both are required by Storage but never called by createJSONStorage.
  get length() {
    return 0;
  },
  key: () => null,
  clear: () => {},
};

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
    speakingReflectionValues.includes(
      reflection as (typeof speakingReflectionValues)[number],
    )
  );
}

/**
 * Runtime validation for the persisted payload. Mirrors the contract of
 * the legacy localStorage helpers so consumers see the same data shape.
 */
function parseSession(raw: unknown): ActiveSpeakingSession | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const parsed = raw as Partial<ActiveSpeakingSession>;

  if (
    typeof parsed.id !== "string" ||
    typeof parsed.promptId !== "string" ||
    typeof parsed.promptTitle !== "string" ||
    typeof parsed.createdAt !== "number" ||
    typeof parsed.elapsedSeconds !== "number" ||
    typeof parsed.updatedAt !== "number" ||
    (parsed.lastResumedAt !== null &&
      typeof parsed.lastResumedAt !== "number") ||
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
      typeof parsed.transcriptDraft === "string"
        ? parsed.transcriptDraft
        : "",
    updatedAt: parsed.updatedAt,
  };
}

type ActiveSessionState = {
  activeSession: ActiveSpeakingSession | null;
};

type ActiveSessionActions = {
  setActiveSession: (session: ActiveSpeakingSession) => void;
  clearActiveSession: () => void;
  /** Sync getter — reads current state. Prefer the `useActiveSessionStore` hook in components. */
  getActiveSession: () => ActiveSpeakingSession | null;
};

type ActiveSessionStore = ActiveSessionState & ActiveSessionActions;

export const useActiveSessionStore = create<ActiveSessionStore>()(
  persist(
    (set, get) => ({
      activeSession: null,

      setActiveSession: (session) => {
        set({ activeSession: session });
      },

      clearActiveSession: () => {
        set({ activeSession: null });
      },

      getActiveSession: () => {
        return get().activeSession;
      },
    }),
    {
      name: "english-os:active-speaking-session",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      version: 1,
      // No partialize — the WHOLE state is just `activeSession`.
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.activeSession = parseSession(state.activeSession);
      },
      merge: (persisted, current) => {
        const incoming = persisted as Partial<ActiveSessionState> | undefined;
        return {
          ...current,
          activeSession: parseSession(incoming?.activeSession),
        };
      },
    },
  ),
);
