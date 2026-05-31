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

    setNotice("Submission recorded locally. Feedback can build from this attempt next.");
  }, [activeDraft, clearAutosave, editorContent, persistDraft, recordEvent]);

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
    isLoadingDraft,
    notice,
    saveState: resolvedSaveState,
    tasks: workspace.tasks,
    wordCount,
    workspaceError,
  } as const;
}
