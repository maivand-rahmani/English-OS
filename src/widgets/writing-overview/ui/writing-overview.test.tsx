import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { WritingOverview } from "./writing-overview";

const mockWorkspace = {
  activeDraft: {
    content:
      "travel helps me meet people and travel helps me learn faster because i notice new habits",
    createdAt: 50,
    id: "draft-1",
    lastSubmittedAt: 100,
    lastWordCount: 15,
    submissionCount: 1,
    taskId: "task-1",
    title: "Travel reflection",
    updatedAt: 180,
  },
  activeTask: {
    blockId: "block-1",
    blockTitle: "Talk about personal experiences",
    estimatedMinutes: 20,
    id: "task-1",
    instructions: "Write one paragraph about why travel matters to you.",
    slug: "travel-reflection",
    stageTitle: "Build everyday fluency",
    successCriteria: "Explain one personal reason and keep the response easy to follow.",
    summary: "A short personal paragraph about travel and learning.",
    title: "Travel reflection",
    wordCountMax: 90,
    wordCountMin: 40,
  },
  drafts: [
    {
      id: "draft-1",
      lastSubmittedAt: 100,
      lastWordCount: 15,
      submissionCount: 1,
      taskId: "task-1",
      title: "Travel reflection",
      updatedAt: 180,
    },
  ],
  editorContent:
    "travel helps me meet people and travel helps me learn faster because i notice new habits",
  events: [
    {
      id: "event-1",
      payload: {
        draftId: "draft-1",
        taskId: "task-1",
        wordCount: 15,
      },
      synced: false,
      timestamp: 100,
      type: "writing_submitted",
    },
  ],
  eventsLoading: false,
  focusBlock: {
    id: "block-1",
    summary: "Use everyday topics to build flexible output.",
    title: "Talk about personal experiences",
  },
  handleCreateDraft: vi.fn(),
  handleEditorChange: vi.fn(),
  handleSaveNow: vi.fn(),
  handleSelectTask: vi.fn(),
  handleSubmitDraft: vi.fn(),
  isLoadingDraft: false,
  notice: null,
  saveState: "saved" as const,
  tasks: [
    {
      blockId: "block-1",
      blockTitle: "Talk about personal experiences",
      draft: {
        id: "draft-1",
        lastSubmittedAt: 100,
        lastWordCount: 15,
        submissionCount: 1,
        taskId: "task-1",
        title: "Travel reflection",
        updatedAt: 180,
      },
      estimatedMinutes: 20,
      id: "task-1",
      instructions: "Write one paragraph about why travel matters to you.",
      isActive: true,
      isRecommended: true,
      slug: "travel-reflection",
      stageTitle: "Build everyday fluency",
      successCriteria: "Explain one personal reason and keep the response easy to follow.",
      summary: "A short personal paragraph about travel and learning.",
      title: "Travel reflection",
      wordCountMax: 90,
      wordCountMin: 40,
    },
  ],
  wordCount: 15,
  workspaceError: null,
};

vi.mock("../model/use-writing-workspace", () => ({
  useWritingWorkspace: () => mockWorkspace,
}));

vi.mock("@/shared/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true,
}));

describe("WritingOverview", () => {
  test("renders the feedback-ready writing workspace after a submission", () => {
    render(<WritingOverview content={buildContentStub()} />);

    expect(screen.getByText("Feedback view")).toBeInTheDocument();
    expect(screen.getByText("Local practice history")).toBeInTheDocument();
    expect(screen.getAllByText("Revision in progress").length).toBeGreaterThan(0);
    expect(screen.getByText("Grammar notes")).toBeInTheDocument();
    expect(screen.getByText("Pattern notes")).toBeInTheDocument();
    expect(screen.getByText("Rewrite loop")).toBeInTheDocument();
    expect(screen.getByText("Correction slot")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /resubmit revised draft/i }),
    ).toBeInTheDocument();
  });
});

function buildContentStub() {
  return {
    audienceLabel: "Adults",
    templateTitle: "English OS V1",
  } as Parameters<typeof WritingOverview>[0]["content"];
}
