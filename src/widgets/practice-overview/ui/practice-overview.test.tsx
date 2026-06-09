import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { DashboardContentState } from "@/entities/dashboard";

import { PracticeOverview } from "./practice-overview";

const useReducedMotionMock = vi.fn();
const useWritingWorkspaceMock = vi.fn();
const useSpeakingWorkspaceMock = vi.fn();

vi.mock("framer-motion", () => {
  function passthrough(tag: "div" | "section" | "span") {
    return ({
      animate: _animate,
      children,
      exit: _exit,
      initial: _initial,
      layoutId: _layoutId,
      transition: _transition,
      ...props
    }: any) =>
      React.createElement(tag, props, children);
  }

  return {
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    motion: {
      div: passthrough("div"),
      section: passthrough("section"),
      span: passthrough("span"),
    },
  };
});

vi.mock("@/shared/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => useReducedMotionMock(),
}));

vi.mock("@/widgets/writing-overview/model/use-writing-workspace", () => ({
  useWritingWorkspace: () => useWritingWorkspaceMock(),
}));

vi.mock("@/widgets/speaking-overview/model/use-speaking-workspace", () => ({
  useSpeakingWorkspace: () => useSpeakingWorkspaceMock(),
}));

describe("PracticeOverview", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/practice?mode=writing");
    useReducedMotionMock.mockReset();
    useWritingWorkspaceMock.mockReset();
    useSpeakingWorkspaceMock.mockReset();
    useReducedMotionMock.mockReturnValue(true);
    useWritingWorkspaceMock.mockReturnValue(buildWritingWorkspaceMock());
    useSpeakingWorkspaceMock.mockReturnValue(buildSpeakingWorkspaceMock());
  });

  test("renders a single writing workspace without the old page header pattern", () => {
    render(<PracticeOverview content={buildContentStub()} mode="writing" />);

    expect(
      screen.getByRole("tabpanel", { name: /writing workspace/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit writing/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^feedback$/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /practice/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Practice is now the single top-level home for active output/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/ready for feedback later/i)).not.toBeInTheDocument();
  });

  test("switches to the speaking workspace inside the same canvas and updates the mode query", () => {
    render(<PracticeOverview content={buildContentStub()} mode="writing" />);

    fireEvent.click(screen.getByRole("tab", { name: /speaking mode/i }));

    expect(
      screen.getByRole("tabpanel", { name: /speaking workspace/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start speaking/i })).toBeInTheDocument();
    expect(window.location.search).toBe("?mode=speaking");
  });
});

function buildContentStub() {
  return {} as DashboardContentState;
}

function buildWritingWorkspaceMock() {
  return {
    activeDraft: {
      id: "draft-1",
      lastSubmittedAt: 1710000000000,
      lastWordCount: 132,
      submissionCount: 1,
      taskId: "task-1",
      title: "Travel email",
      updatedAt: 1710000000000,
    },
    activeTask: {
      id: "task-1",
      blockId: "block-1",
      blockTitle: "Travel",
      estimatedMinutes: 15,
      instructions: "Write a short email about your last trip.",
      slug: "travel-email",
      stageTitle: "Build output",
      summary: "A short practical writing task.",
      successCriteria: "Keep the email clear and easy to follow.",
      title: "Travel email",
      wordCountMax: 160,
      wordCountMin: 110,
    },
    drafts: [],
    editorContent: "I went to Ankara last weekend.",
    events: [],
    eventsLoading: false,
    focusBlock: null,
    handleCreateDraft: vi.fn(),
    handleEditorChange: vi.fn(),
    handleSaveNow: vi.fn(),
    handleSelectTask: vi.fn(),
    handleSubmitDraft: vi.fn(),
    isLoadingDraft: false,
    notice: null,
    saveState: "saved",
    tasks: [
      {
        blockId: "block-1",
        blockTitle: "Travel",
        draft: undefined,
        estimatedMinutes: 15,
        id: "task-1",
        instructions: "Write a short email about your last trip.",
        isActive: true,
        isRecommended: true,
        slug: "travel-email",
        stageTitle: "Build output",
        summary: "A short practical writing task.",
        successCriteria: "Keep the email clear and easy to follow.",
        title: "Travel email",
        wordCountMax: 160,
        wordCountMin: 110,
      },
      {
        blockId: "block-2",
        blockTitle: "Plans",
        draft: undefined,
        estimatedMinutes: 12,
        id: "task-2",
        instructions: "Write a short plan for next month.",
        isActive: false,
        isRecommended: false,
        slug: "plan-month",
        stageTitle: "Build output",
        summary: "A short planning task.",
        successCriteria: null,
        title: "Plan next month",
        wordCountMax: 140,
        wordCountMin: 90,
      },
    ],
    wordCount: 6,
    workspaceError: null,
  } as const;
}

function buildSpeakingWorkspaceMock() {
  return {
    activePrompt: {
      blockId: "block-3",
      blockTitle: "Daily life",
      estimatedMinutes: 8,
      followUpQuestion: "What would you change next time?",
      id: "prompt-1",
      prepHint: "Think of one specific example first.",
      promptText: "Talk about a normal weekday in your city.",
      slug: "weekday-city",
      stageTitle: "Build output",
      summary: "A short personal speaking prompt.",
      targetDurationSeconds: 90,
      title: "Weekday in your city",
    },
    activeSession: null,
    elapsedSeconds: 0,
    events: [],
    eventsLoading: false,
    focusBlock: null,
    handleChooseReflection: vi.fn(),
    handleClearSession: vi.fn(),
    handleFinishSession: vi.fn(),
    handlePauseSession: vi.fn(),
    handleResumeSession: vi.fn(),
    handleSaveSession: vi.fn(),
    handleSelectPrompt: vi.fn(),
    handleStartSession: vi.fn(),
    handleTranscriptChange: vi.fn(),
    notice: null,
    prompts: [
      {
        blockId: "block-3",
        blockTitle: "Daily life",
        estimatedMinutes: 8,
        followUpQuestion: "What would you change next time?",
        id: "prompt-1",
        isActive: true,
        isRecommended: true,
        lastRecordedAt: null,
        prepHint: "Think of one specific example first.",
        promptText: "Talk about a normal weekday in your city.",
        slug: "weekday-city",
        stageTitle: "Build output",
        summary: "A short personal speaking prompt.",
        targetDurationSeconds: 90,
        title: "Weekday in your city",
      },
      {
        blockId: "block-4",
        blockTitle: "Food",
        estimatedMinutes: 6,
        followUpQuestion: null,
        id: "prompt-2",
        isActive: false,
        isRecommended: false,
        lastRecordedAt: null,
        prepHint: null,
        promptText: "Talk about a meal you enjoyed recently.",
        slug: "meal-recently",
        stageTitle: "Build output",
        summary: "A short everyday speaking prompt.",
        targetDurationSeconds: 60,
        title: "Recent meal",
      },
    ],
    reflectionLabel: null,
    reflectionOptions: [
      {
        detail: "The answer felt comfortable.",
        label: "Felt easy",
        value: "felt_easy",
      },
    ],
    sessionSummary: {
      detail: "Start one speaking return and save a short reflection after it.",
      label: "No active session",
    },
    transcriptDraft: "",
    transcriptSummary: {
      detail: "Add a rough transcript after speaking.",
      label: "No transcript yet",
      wordCount: 0,
    },
    workspaceError: null,
  } as const;
}
