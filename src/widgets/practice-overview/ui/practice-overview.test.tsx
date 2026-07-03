import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { DashboardContentState } from "@/entities/dashboard";

import { PracticeOverview } from "./practice-overview";

const useReducedMotionMock = vi.fn();
const useWritingWorkspaceMock = vi.fn();
const useSpeakingWorkspaceMock = vi.fn();

vi.mock("framer-motion", () => {
  type MotionProps = React.HTMLAttributes<HTMLElement> & {
    animate?: unknown;
    children?: React.ReactNode;
    exit?: unknown;
    initial?: unknown;
    layoutId?: string;
    transition?: unknown;
  };

  function stripMotionProps(props: MotionProps) {
    const nextProps: Record<string, unknown> = { ...props };

    delete nextProps.animate;
    delete nextProps.exit;
    delete nextProps.initial;
    delete nextProps.layoutId;
    delete nextProps.transition;

    return nextProps;
  }

  function passthrough(tag: "div" | "section" | "span") {
    const Component = ({ children, ...props }: MotionProps) =>
      React.createElement(tag, stripMotionProps(props), children);

    Component.displayName = `MockMotion${tag[0].toUpperCase()}${tag.slice(1)}`;

    return Component;
  }

  const MockAnimatePresence = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );
  MockAnimatePresence.displayName = "MockAnimatePresence";

  return {
    AnimatePresence: MockAnimatePresence,
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

vi.mock("../model/writing/use-writing-workspace", () => ({
  useWritingWorkspace: () => useWritingWorkspaceMock(),
}));

vi.mock("../model/speaking/use-speaking-workspace", () => ({
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

  test("renders a single writing studio without any page header copy above it", () => {
    useWritingWorkspaceMock.mockReturnValue(
      buildWritingWorkspaceMock({ liveDraft: true }),
    );

    render(<PracticeOverview content={buildContentStub()} mode="writing" />);

    const modeTablist = screen.getByRole("tablist", { name: /practice mode/i });
    const modeTabs = within(modeTablist).getAllByRole("tab");

    expect(modeTablist).toBeInTheDocument();
    expect(modeTabs[0]).toHaveAccessibleName(/writing mode/i);
    expect(modeTabs[1]).toHaveAccessibleName(/speaking mode/i);
    expect(
      screen.getByRole("tabpanel", { name: /writing workspace/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save writing/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /get ai feedback/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /practice/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/ACTIVE OUTPUT PRACTICE/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/One V1 practice home/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^feedback$/i)).not.toBeInTheDocument();
  });

  test("renders verdict badge and navigation actions after AI feedback arrives", () => {
    useWritingWorkspaceMock.mockReturnValue(
      buildWritingWorkspaceMock({ submitted: true, withFeedback: true }),
    );

    render(<PracticeOverview content={buildContentStub()} mode="writing" />);

    const panel = screen.getByRole("tabpanel", { name: /writing workspace/i });

    expect(within(panel).getByText(/ready to move on/i)).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^next$/i })).toBeInTheDocument();
  });

  test("switches to the speaking workspace inside the same studio and updates the mode query", () => {
    render(<PracticeOverview content={buildContentStub()} mode="writing" />);

    fireEvent.click(screen.getByRole("tab", { name: /speaking mode/i }));

    const panel = screen.getByRole("tabpanel", { name: /speaking workspace/i });

    expect(panel).toBeInTheDocument();
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(within(panel).getByRole("button", { name: /start speaking/i })).toBeInTheDocument();
    expect(window.location.search).toBe("?mode=speaking");
  });

  test("keeps live speaking controls reachable inside the shared studio surface", () => {
    useSpeakingWorkspaceMock.mockReturnValue(buildSpeakingWorkspaceMock({ liveSession: true }));

    render(<PracticeOverview content={buildContentStub()} mode="speaking" />);

    const panel = screen.getByRole("tabpanel", { name: /speaking workspace/i });

    expect(within(panel).getByRole("button", { name: /^pause$/i })).toBeInTheDocument();
    expect(
      within(panel).getByRole("button", { name: /finish speaking/i }),
    ).toBeInTheDocument();
  });
});

function buildContentStub(): DashboardContentState {
  return {
    displayName: "Test User",
    learnerLevelLabel: "A1",
    goalLabel: "Test goal",
    templateTitle: "Test template",
    templateDescription: null,
    audienceLabel: "Beginner",
    estimatedWeeks: null,
    stageCount: 0,
    blockCount: 0,
    resourceCount: 0,
    stages: [],
  };
}

function buildWritingWorkspaceMock({
  liveDraft = false,
  submitted = false,
  withFeedback = false,
}: {
  liveDraft?: boolean;
  submitted?: boolean;
  withFeedback?: boolean;
} = {}) {
  const submittedAt = submitted || withFeedback ? 1710000000000 : undefined;
  return {
    activeDraft: {
      id: "draft-1",
      lastSubmittedAt: submittedAt,
      lastWordCount: submitted || withFeedback ? 132 : undefined,
      submissionCount: submitted || withFeedback ? 1 : undefined,
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
    editorContent: liveDraft ? "I went to Ankara last weekend." : "",
    events: [],
    eventsLoading: false,
    focusBlock: null,
    handleCreateDraft: vi.fn(),
    handleEditorChange: vi.fn(),
    handleSaveNow: vi.fn(),
    handleSelectTask: vi.fn(),
    handleSubmitDraft: vi.fn(),
    handleSubmitAndRequestFeedback: vi.fn(),
    handleTryAgain: vi.fn(),
    handleNextTask: vi.fn(),
    isLoadingDraft: false,
    notice: null,
    saveState: liveDraft ? "saved" : "idle",
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
    wordCount: liveDraft ? 6 : 0,
    workspaceError: null,
    aiFeedback: withFeedback
      ? {
          correctedVersion: null,
          detectedPatterns: [],
          feedbackSummary: "You addressed the prompt clearly.",
          grammarNotes: [],
          keyIssues: [],
          naturalnessSuggestions: [],
          nextPracticeFocus: "Move on to the next task.",
          overallSummary: "Strong response.",
          verdict: "pass",
          vocabularySuggestions: [],
        }
      : null,
    aiFeedbackLoading: false,
    aiFeedbackError: null,
    requestAiFeedback: vi.fn(),
  } as const;
}

function buildSpeakingWorkspaceMock({
  liveSession = false,
}: {
  liveSession?: boolean;
} = {}) {
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
    activeSession: liveSession
      ? {
          createdAt: 1710000000000,
          elapsedSeconds: 42,
          id: "session-1",
          lastResumedAt: 1710000002000,
          promptId: "prompt-1",
          promptTitle: "Weekday in your city",
          reflection: null,
          status: "active",
          transcriptDraft: "",
          updatedAt: 1710000003000,
        }
      : null,
    elapsedSeconds: liveSession ? 42 : 0,
    events: [],
    eventsLoading: false,
    focusBlock: null,
    handleChooseReflection: vi.fn(),
    handleClearSession: vi.fn(),
    handleFinishSession: vi.fn(),
    handlePauseSession: vi.fn(),
    handleResumeSession: vi.fn(),
    handleSaveSession: vi.fn(),
    handleSaveAndRequestFeedback: vi.fn(),
    handleSelectPrompt: vi.fn(),
    handleStartSession: vi.fn(),
    handleTranscriptChange: vi.fn(),
    handleTryAgain: vi.fn(),
    handleNextTask: vi.fn(),
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
      detail: liveSession
        ? "Speak out loud now. Pause if you need a breath, then finish when the answer feels complete enough."
        : "Start one speaking return and save a short reflection after it.",
      label: liveSession ? "Speaking live for 42s" : "No active session",
    },
    transcriptDraft: "",
    transcriptSummary: {
      detail: "Add a rough transcript after speaking.",
      label: "No transcript yet",
      wordCount: 0,
    },
    workspaceError: null,
    aiFeedback: null,
    aiFeedbackLoading: false,
    aiFeedbackError: null,
    requestAiFeedback: vi.fn(),
  } as const;
}
