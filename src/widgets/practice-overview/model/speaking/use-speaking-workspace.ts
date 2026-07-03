"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DashboardContentState } from "@/entities/dashboard";
import { useSpeakingFeedbackMutation } from "@/features/ai/api/speaking-feedback.mutations";
import { useEventsStore } from "@/features/learners/model/events-store";
import { useProgressStore } from "@/features/learners/model/progress-store";
import {
  LearningEventType,
  type ActiveSpeakingSession,
  type SpeakingReflection,
} from "@/shared/types";

import { useActiveSessionStore } from "./active-session-store";
import {
  getReflectionLabel,
  getSpeakingSessionElapsed,
  getSpeakingSessionSummary,
  getTranscriptSummary,
  speakingReflectionOptions,
} from "./speaking-session-helpers";
import { getSpeakingWorkspaceState } from "./speaking-workspace-state";

export function useSpeakingWorkspace(content: DashboardContentState) {
  const entries = useProgressStore((s) => s.entries);
  const events = useEventsStore((s) => s.events);
  const eventsLoading = useEventsStore((s) => s.isLoading);
  const recordEvent = useEventsStore((s) => s.recordEvent);

  const persistedSession = useActiveSessionStore((s) => s.activeSession);
  const setPersistedSession = useActiveSessionStore((s) => s.setActiveSession);
  const clearPersistedSession = useActiveSessionStore((s) => s.clearActiveSession);

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(
    () => persistedSession?.promptId ?? null,
  );
  const [activeSession, setSession] = useState(persistedSession);
  const [notice, setNotice] = useState<string | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [timerNow, setTimerNow] = useState(0);

  const feedbackMutation = useSpeakingFeedbackMutation();
  const abortControllerRef = useRef<AbortController | null>(null);

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
      clearPersistedSession();
    }
  }, [hasOrphanedSession, clearPersistedSession]);

  function persistSession(nextSession: ActiveSpeakingSession) {
    setPersistedSession(nextSession);
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

    clearPersistedSession();
    setSession(null);
    setSelectedPromptId(session.promptId);
    setTimerNow(Date.now());
    setWorkspaceError(null);
    setNotice("Speaking session saved locally.");
  }

  async function handleSaveAndRequestFeedback() {
    if (!session || !activePrompt) {
      return;
    }

    if (session.status !== "reflecting") {
      setWorkspaceError("Finish the session before trying to save it.");
      return;
    }

    const durationSeconds = getSpeakingSessionElapsed(session, Date.now());

    if (durationSeconds === 0) {
      setWorkspaceError("The session is still empty. Speak first, then save it.");
      return;
    }

    const capturedTranscript = session.transcriptDraft;
    const capturedReflection = session.reflection;
    const capturedTitle = session.promptTitle;

    await recordEvent({
      type: LearningEventType.SpeakingRecorded,
      payload: {
        durationSeconds,
        promptId: session.promptId,
        reflection: capturedReflection ?? undefined,
        sessionId: session.id,
        transcript: capturedTranscript.trim() || undefined,
      },
    });

    feedbackMutation.reset();
    setNotice("Session saved. AI feedback is loading...");
    setWorkspaceError(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    feedbackMutation.mutate(
      {
        payload: {
          type: "initial",
          prompt: activePrompt.promptText,
          transcript: capturedTranscript,
          learnerLevel: content.learnerLevelLabel ?? "Beginner",
        },
        signal: controller.signal,
      },
      {
        onSettled: () => {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }
        },
      },
    );

    setNotice(
      `Session for "${capturedTitle}" saved. AI feedback is ready.`,
    );
  }

  function handleTryAgain() {
    if (!activePrompt) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    feedbackMutation.reset();
    clearPersistedSession();
    setSession(null);
    setTimerNow(Date.now());
    setNotice(null);
    setWorkspaceError(null);
  }

  function handleNextTask() {
    if (!rawWorkspace.prompts.length) {
      return;
    }

    const currentIndex = rawWorkspace.prompts.findIndex(
      (prompt) => prompt.id === activePrompt?.id,
    );
    const nextPrompt =
      rawWorkspace.prompts[currentIndex + 1] ?? rawWorkspace.prompts[0] ?? null;

    if (!nextPrompt) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    feedbackMutation.reset();
    clearPersistedSession();
    setSession(null);
    setTimerNow(Date.now());
    setSelectedPromptId(nextPrompt.id);
    setNotice(
      currentIndex === rawWorkspace.prompts.length - 1
        ? "All speaking prompts wrapped. Starting the queue over."
        : `Moved to "${nextPrompt.title}".`,
    );
    setWorkspaceError(null);
  }

  function handleClearSession() {
    if (!session) {
      return;
    }

    clearPersistedSession();
    setSession(null);
    setTimerNow(Date.now());
    setWorkspaceError(null);
    setNotice("The local speaking session was cleared.");
  }

  const requestAiFeedback = useCallback(async () => {
    if (!activePrompt || !transcriptDraft.trim()) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    feedbackMutation.mutate(
      {
        payload: {
          type: "reflection",
          prompt: activePrompt.promptText,
          learnerReflection: reflectionLabel ?? "",
          originalTranscript: transcriptDraft,
          learnerLevel: content.learnerLevelLabel ?? "Beginner",
        },
        signal: controller.signal,
      },
      {
        onSettled: () => {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }
        },
      },
    );
  }, [
    activePrompt,
    transcriptDraft,
    reflectionLabel,
    content.learnerLevelLabel,
    feedbackMutation,
  ]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, []);

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
    handleSaveAndRequestFeedback,
    handleSelectPrompt,
    handleStartSession,
    handleTranscriptChange,
    handleTryAgain,
    handleNextTask,
    notice,
    prompts: workspace.prompts,
    reflectionLabel,
    reflectionOptions: speakingReflectionOptions,
    sessionSummary,
    transcriptDraft,
    transcriptSummary,
    workspaceError: resolvedWorkspaceError,
    aiFeedback: feedbackMutation.data ?? null,
    isFetchingFeedback: feedbackMutation.isPending,
    feedbackError: feedbackMutation.error?.message ?? null,
    requestAiFeedback,
  } as const;
}
