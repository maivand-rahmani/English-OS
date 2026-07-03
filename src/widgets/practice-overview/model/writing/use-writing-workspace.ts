"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DashboardContentState } from "@/entities/dashboard";
import { useDrafts } from "@/shared/hooks/use-drafts";
import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import { LearningEventType, type Draft } from "@/shared/types";
import type { WritingTaskWithContext } from "@/widgets/dashboard-overview/model/dashboard-overview-types";

import { countWords } from "./writing-draft-helpers";
import { getWritingWorkspaceState } from "./writing-workspace-state";

type SaveState = "idle" | "dirty" | "saved" | "saving" | "submitting";

type WritingVerdict = "pass" | "retry" | "needs_work";

type AiWritingFeedbackResult = {
  verdict: WritingVerdict;
  feedbackSummary: string;
  overallSummary: string;
  correctedVersion: string | null;
  keyIssues: Array<{ title: string; detail: string }>;
  naturalnessSuggestions: string[];
  grammarNotes: string[];
  vocabularySuggestions: string[];
  nextPracticeFocus: string;
  detectedPatterns: Array<{ label: string; detail: string }>;
};

export function useWritingWorkspace(content: DashboardContentState) {
  const { entries } = useLocalProgress();
  const { drafts, createDraft, getDraft, saveDraft } = useDrafts();
  const { events, isLoading: eventsLoading, recordEvent } = useLearningEvents(20);

  const [activeDraft, setActiveDraft] = useState<Draft | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  const [aiFeedback, setAiFeedback] = useState<AiWritingFeedbackResult | null>(
    null,
  );
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState<string | null>(null);

  const autosaveTimeoutRef = useRef<number | null>(null);
  const workspace = getWritingWorkspaceState(content, entries, drafts, selectedTaskId);
  const activeDraftSummary = workspace.activeDraft;
  const activeDraftId = activeDraftSummary?.id ?? null;
  const activeTask = workspace.activeTask;
  const wordCount = countWords(editorContent);
  const resolvedSaveState =
    saveState === "saving" || saveState === "submitting"
      ? saveState
      : activeDraft && editorContent !== activeDraft.content
        ? "dirty"
        : activeDraft
          ? "saved"
          : saveState;

  const clearAutosave = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }
  }, []);

  const persistDraft = useCallback(
    async (
      nextDraft: Draft,
      nextState: Exclude<SaveState, "dirty" | "idle"> = "saving",
    ) => {
      setSaveState(nextState);
      const savedDraft = await saveDraft(nextDraft);

      if (!savedDraft) {
        setWorkspaceError("Local draft save failed. Try again in a moment.");
        setSaveState("dirty");
        return undefined;
      }

      setActiveDraft(savedDraft);
      setSaveState("saved");
      setWorkspaceError(null);
      return savedDraft;
    },
    [saveDraft],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadActiveDraft() {
      if (!activeDraftId) {
        setActiveDraft(null);
        setEditorContent("");
        setIsLoadingDraft(false);
        setSaveState("idle");
        setWorkspaceError(null);
        return;
      }

      setIsLoadingDraft(true);

      try {
        const draft = await getDraft(activeDraftId);

        if (!cancelled) {
          setActiveDraft(draft ?? null);
          setEditorContent(draft?.content ?? "");
          setSaveState("saved");
          setWorkspaceError(null);
        }
      } catch {
        if (!cancelled) {
          setWorkspaceError("The local draft could not be opened.");
          setActiveDraft(null);
          setEditorContent("");
          setSaveState("idle");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDraft(false);
        }
      }
    }

    void loadActiveDraft();

    return () => {
      cancelled = true;
    };
  }, [activeDraftId, getDraft]);

  useEffect(() => {
    return () => {
      clearAutosave();
    };
  }, [clearAutosave]);

  useEffect(() => {
    if (!activeDraft) {
      return;
    }

    if (editorContent === activeDraft.content) {
      return;
    }

    clearAutosave();

    autosaveTimeoutRef.current = window.setTimeout(() => {
      autosaveTimeoutRef.current = null;
      void persistDraft(
        {
          ...activeDraft,
          content: editorContent,
        },
        "saving",
      );
    }, 700);

    return () => {
      clearAutosave();
    };
  }, [activeDraft, clearAutosave, editorContent, persistDraft]);

  const handleCreateDraft = useCallback(
    async (task: WritingTaskWithContext) => {
      clearAutosave();
      setNotice(null);
      setWorkspaceError(null);
      setSelectedTaskId(task.id);

      try {
        const draft = await createDraft(task.title, "", task.id);
        setActiveDraft(draft);
        setEditorContent(draft.content);
        setSaveState("saved");
        setNotice(`Draft started for "${task.title}".`);
      } catch {
        setWorkspaceError("Draft creation failed. Try again in a moment.");
      }
    },
    [clearAutosave, createDraft],
  );

  const handleSelectTask = useCallback((taskId: string) => {
    setNotice(null);
    setWorkspaceError(null);
    setSelectedTaskId(taskId);
    setAiFeedback(null);
    setAiFeedbackError(null);
    setAiFeedbackLoading(false);
  }, []);

  const handleEditorChange = useCallback((nextContent: string) => {
    setNotice(null);
    setWorkspaceError(null);
    setEditorContent(nextContent);
  }, []);

  const handleSaveNow = useCallback(async () => {
    if (!activeDraft) {
      return;
    }

    clearAutosave();

    const savedDraft = await persistDraft(
      {
        ...activeDraft,
        content: editorContent,
      },
      "saving",
    );

    if (savedDraft) {
      setNotice("Draft saved locally.");
    }
  }, [activeDraft, clearAutosave, editorContent, persistDraft]);

  const handleSubmitDraft = useCallback(async () => {
    if (!activeDraft) {
      setWorkspaceError("Start a draft before trying to submit.");
      return;
    }

    const nextWordCount = countWords(editorContent);

    if (nextWordCount === 0) {
      setWorkspaceError("Write something first, then submit the attempt.");
      return;
    }

    clearAutosave();
    setNotice(null);
    setWorkspaceError(null);

    const submittedDraft = await persistDraft(
      {
        ...activeDraft,
        content: editorContent,
        lastSubmittedAt: Date.now(),
        lastWordCount: nextWordCount,
        submissionCount: (activeDraft.submissionCount ?? 0) + 1,
      },
      "submitting",
    );

    if (!submittedDraft) {
      return;
    }

    await recordEvent({
      type: LearningEventType.WritingSubmitted,
      payload: {
        draftId: submittedDraft.id,
        taskId: submittedDraft.taskId,
        wordCount: nextWordCount,
      },
    });

    setNotice("Submission recorded locally. AI feedback is loading...");
  }, [activeDraft, clearAutosave, editorContent, persistDraft, recordEvent]);

  const requestAiFeedback = useCallback(async () => {
    if (!activeDraft || !activeTask) {
      return;
    }

    setAiFeedbackLoading(true);
    setAiFeedbackError(null);

    try {
      const response = await fetch("/api/ai/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerLevel: content.learnerLevelLabel ?? "Beginner",
          taskPrompt: activeTask.instructions || activeTask.title,
          learnerResponse: editorContent,
          roadmapContext: activeTask.blockTitle ?? undefined,
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
  }, [activeDraft, activeTask, editorContent, content.learnerLevelLabel]);

  const handleSubmitAndRequestFeedback = useCallback(async () => {
    if (!activeDraft || !activeTask) {
      return;
    }

    setAiFeedback(null);
    setAiFeedbackError(null);
    await handleSubmitDraft();
    await requestAiFeedback();
  }, [activeDraft, activeTask, handleSubmitDraft, requestAiFeedback]);

  const handleTryAgain = useCallback(async () => {
    if (!activeDraft) {
      return;
    }

    clearAutosave();
    setAiFeedback(null);
    setAiFeedbackError(null);
    setAiFeedbackLoading(false);
    setNotice(null);
    setWorkspaceError(null);

    const fullDraft = await getDraft(activeDraft.id);

    if (!fullDraft) {
      setWorkspaceError("Could not reopen this draft for another attempt.");
      return;
    }

    const resetDraft = await saveDraft({
      ...fullDraft,
      lastSubmittedAt: undefined,
      lastWordCount: undefined,
      updatedAt: Date.now(),
    });

    if (!resetDraft) {
      setWorkspaceError("Could not reopen this draft for another attempt.");
      return;
    }

    setActiveDraft(resetDraft);
    setEditorContent(resetDraft.content);
    setSaveState("saved");
    setNotice("Ready for another attempt on this task.");
  }, [activeDraft, clearAutosave, getDraft, saveDraft]);

  const handleNextTask = useCallback(() => {
    if (workspace.tasks.length === 0) {
      return;
    }

    const currentIndex = workspace.tasks.findIndex(
      (task) => task.id === activeTask?.id,
    );
    const nextTask =
      workspace.tasks[currentIndex + 1] ?? workspace.tasks[0] ?? null;

    if (!nextTask) {
      return;
    }

    handleSelectTask(nextTask.id);
    setNotice(
      currentIndex === workspace.tasks.length - 1
        ? "All writing tasks wrapped. Starting the queue over."
        : `Moved to "${nextTask.title}".`,
    );
  }, [workspace.tasks, activeTask, handleSelectTask]);

  return {
    activeDraft,
    activeTask,
    drafts,
    editorContent,
    events,
    eventsLoading,
    focusBlock: workspace.focusBlock,
    handleCreateDraft,
    handleEditorChange,
    handleSaveNow,
    handleSelectTask,
    handleSubmitDraft,
    handleSubmitAndRequestFeedback,
    handleTryAgain,
    handleNextTask,
    isLoadingDraft,
    notice,
    saveState: resolvedSaveState,
    tasks: workspace.tasks,
    wordCount,
    workspaceError,
    aiFeedback,
    aiFeedbackLoading,
    aiFeedbackError,
    requestAiFeedback,
  } as const;
}
