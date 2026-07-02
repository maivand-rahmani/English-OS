"use client";

import { useCallback, useEffect, useState } from "react";

import type { DashboardContentState } from "@/entities/dashboard";
import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import {
  clearActiveSpeakingSession,
  getActiveSpeakingSession,
  setActiveSpeakingSession,
} from "@/shared/persistence";
import {
  LearningEventType,
  type ActiveSpeakingSession,
  type SpeakingReflection,
} from "@/shared/types";

type AiSpeakingFeedbackResult = {
  overallSummary: string;
  clarityFeedback: string;
  grammarFeedback: string;
  vocabularyFeedback: string;
  fluencyFeedback: string;
  strongerResponseExample: string;
  nextPracticeFocus: string;
  detectedPatterns: Array<{ label: string; detail: string }>;
  confidenceNote: string;
};

import {
  getReflectionLabel,
  getSpeakingSessionElapsed,
  getSpeakingSessionSummary,
  getTranscriptSummary,
  speakingReflectionOptions,
} from "./speaking-session-helpers";
import { getSpeakingWorkspaceState } from "./speaking-workspace-state";

export function useSpeakingWorkspace(content: DashboardContentState) {
  const { entries } = useLocalProgress();
  const { events, isLoading: eventsLoading, recordEvent } = useLearningEvents(20);

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(
    () => getActiveSpeakingSession()?.promptId ?? null,
  );
  const [activeSession, setSession] = useState<ActiveSpeakingSession | null>(() =>
    getActiveSpeakingSession(),
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [timerNow, setTimerNow] = useState(0);

  const [aiFeedback, setAiFeedback] = useState<AiSpeakingFeedbackResult | null>(
    null,
  );
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState<string | null>(null);

  const rawWorkspace = getSpeakingWorkspaceState(
    content,
    entries,
    events,
    activeSession?.promptId ?? selectedPromptId,
  );
  const hasOrphanedSession =
    activeSession != null &&
    !rawWorkspace.prompts.some((prompt) => prompt.id === activeSession.promptId);
  const session = hasOrphanedSession ? null : activeSession;
  const workspace = hasOrphanedSession
    ? getSpeakingWorkspaceState(content, entries, events, selectedPromptId)
    : rawWorkspace;
  const activePrompt = workspace.activePrompt;
  const elapsedSeconds = getSpeakingSessionElapsed(session, timerNow);
  const sessionSummary = getSpeakingSessionSummary(session, elapsedSeconds);
  const reflectionLabel = getReflectionLabel(session?.reflection);
  const transcriptDraft = session?.transcriptDraft ?? "";
  const transcriptSummary = getTranscriptSummary(transcriptDraft);
  const resolvedWorkspaceError = hasOrphanedSession
    ? "The saved speaking session could not be matched to a current prompt."
    : workspaceError;

  useEffect(() => {
    if (!session || session.status !== "active") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session]);

  useEffect(() => {
    if (hasOrphanedSession) {
      clearActiveSpeakingSession();
    }
  }, [hasOrphanedSession]);

  function persistSession(nextSession: ActiveSpeakingSession) {
    setActiveSpeakingSession(nextSession);
    setSession(nextSession);
    setSelectedPromptId(nextSession.promptId);
    setTimerNow(Date.now());
    setWorkspaceError(null);
  }

  function buildFrozenSession(
    session: ActiveSpeakingSession,
    status: ActiveSpeakingSession["status"],
  ) {
    const now = Date.now();

    return {
      ...session,
      elapsedSeconds: getSpeakingSessionElapsed(session, now),
      lastResumedAt: status === "active" ? now : null,
      status,
      updatedAt: now,
    } satisfies ActiveSpeakingSession;
  }

  function handleSelectPrompt(promptId: string) {
    if (session && session.promptId !== promptId) {
      setNotice("Finish or clear the current session before switching prompts.");
      return;
    }

    setNotice(null);
    setWorkspaceError(null);
    setSelectedPromptId(promptId);
  }

  function handleStartSession() {
    if (!activePrompt) {
      setWorkspaceError("Choose a speaking prompt before starting a session.");
      return;
    }

    if (session) {
      setNotice("There is already a local speaking session waiting in this workspace.");
      return;
    }

    const now = Date.now();

    persistSession({
      createdAt: now,
      elapsedSeconds: 0,
      id: crypto.randomUUID(),
      lastResumedAt: now,
      promptId: activePrompt.id,
      promptTitle: activePrompt.title,
      reflection: null,
      status: "active",
      transcriptDraft: "",
      updatedAt: now,
    });
    setNotice(`Speaking session started for "${activePrompt.title}".`);
  }

  function handlePauseSession() {
    if (!session || session.status !== "active") {
      return;
    }

    persistSession(buildFrozenSession(session, "paused"));
    setNotice("Speaking session paused locally.");
  }

  function handleResumeSession() {
    if (!session || session.status !== "paused") {
      return;
    }

    persistSession(buildFrozenSession(session, "active"));
    setNotice("Speaking session resumed.");
  }

  function handleFinishSession() {
    if (!session) {
      return;
    }

    const frozenSession = buildFrozenSession(session, "reflecting");

    if (frozenSession.elapsedSeconds === 0) {
      setWorkspaceError("Speak for a few seconds first, then finish the session.");
      return;
    }

    persistSession(frozenSession);
    setNotice("Session finished. Add one quick reflection before saving it.");
  }

  function handleChooseReflection(reflection: SpeakingReflection) {
    if (!session || session.status !== "reflecting") {
      return;
    }

    persistSession({
      ...session,
      reflection,
      updatedAt: Date.now(),
    });
    setNotice("Reflection captured for this speaking return.");
  }

  function handleTranscriptChange(nextTranscript: string) {
    if (!session || session.status !== "reflecting") {
      return;
    }

    persistSession({
      ...session,
      transcriptDraft: nextTranscript,
      updatedAt: Date.now(),
    });
    setNotice(null);
  }

  async function handleSaveSession() {
    if (!session || session.status !== "reflecting") {
      setWorkspaceError("Finish the session before trying to save it.");
      return;
    }

    const durationSeconds = getSpeakingSessionElapsed(session, Date.now());

    if (durationSeconds === 0) {
      setWorkspaceError("The session is still empty. Speak first, then save it.");
      return;
    }

    await recordEvent({
      type: LearningEventType.SpeakingRecorded,
      payload: {
        durationSeconds,
        promptId: session.promptId,
        reflection: session.reflection ?? undefined,
        sessionId: session.id,
        transcript: session.transcriptDraft.trim() || undefined,
      },
    });

    clearActiveSpeakingSession();
    setSession(null);
    setSelectedPromptId(session.promptId);
    setTimerNow(Date.now());
    setWorkspaceError(null);
    setNotice("Speaking session saved locally.");
  }

  function handleClearSession() {
    if (!session) {
      return;
    }

    clearActiveSpeakingSession();
    setSession(null);
    setTimerNow(Date.now());
    setWorkspaceError(null);
    setNotice("The local speaking session was cleared.");
  }

  const requestAiFeedback = useCallback(async () => {
    if (!activePrompt || !transcriptDraft.trim()) {
      return;
    }

    setAiFeedbackLoading(true);
    setAiFeedbackError(null);

    try {
      const response = await fetch("/api/ai/speaking-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerLevel: content.learnerLevelLabel ?? "Beginner",
          promptText: activePrompt.promptText,
          transcript: transcriptDraft,
          learnerReflection: reflectionLabel ?? undefined,
          roadmapContext: activePrompt.blockTitle ?? undefined,
        }),
      });

      const json = await response.json();

      if (json.ok && json.data) {
        setAiFeedback(json.data);
        setAiFeedbackError(null);
      } else {
        setAiFeedbackError(
          json.error?.message ?? "AI feedback unavailable right now.",
        );
      }
    } catch {
      setAiFeedbackError("Could not reach the AI feedback service.");
    } finally {
      setAiFeedbackLoading(false);
    }
  }, [
    activePrompt,
    transcriptDraft,
    reflectionLabel,
    content.learnerLevelLabel,
  ]);

  return {
    activePrompt,
    activeSession: session,
    elapsedSeconds,
    events,
    eventsLoading,
    focusBlock: workspace.focusBlock,
    handleChooseReflection,
    handleClearSession,
    handleFinishSession,
    handlePauseSession,
    handleResumeSession,
    handleSaveSession,
    handleSelectPrompt,
    handleStartSession,
    handleTranscriptChange,
    notice,
    prompts: workspace.prompts,
    reflectionLabel,
    reflectionOptions: speakingReflectionOptions,
    sessionSummary,
    transcriptDraft,
    transcriptSummary,
    workspaceError: resolvedWorkspaceError,
    aiFeedback,
    aiFeedbackLoading,
    aiFeedbackError,
    requestAiFeedback,
  } as const;
}
