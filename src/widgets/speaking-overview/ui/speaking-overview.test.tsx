import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { SpeakingOverview } from "./speaking-overview";

const mockWorkspace = {
  activePrompt: {
    blockId: "block-1",
    blockTitle: "Build simple sentences about yourself",
    estimatedMinutes: 10,
    followUpQuestion: "Which sentence felt easiest to say?",
    id: "prompt-1",
    prepHint: "Write 4 key words before speaking.",
    promptText: "Record a short voice note introducing yourself.",
    slug: "simple-self-introduction",
    stageTitle: "Build a Safe Base",
    summary: "A confidence-first speaking prompt for saying basic personal information out loud.",
    targetDurationSeconds: 60,
    title: "Record a simple self-introduction",
  },
  activeSession: {
    createdAt: 100,
    elapsedSeconds: 72,
    id: "session-1",
    lastResumedAt: null,
    promptId: "prompt-1",
    promptTitle: "Record a simple self-introduction",
    reflection: "felt_easy" as const,
    status: "reflecting" as const,
    transcriptDraft: "I am Sara. I am from Izmir. I like reading and walking in the evening.",
    updatedAt: 200,
  },
  elapsedSeconds: 72,
  events: [
    {
      id: "event-1",
      payload: {
        durationSeconds: 72,
        promptId: "prompt-1",
        reflection: "felt_easy",
        sessionId: "session-1",
        transcript:
          "I am Sara. I am from Izmir. I like reading and walking in the evening.",
      },
      synced: false,
      timestamp: 200,
      type: "speaking_recorded",
    },
  ],
  eventsLoading: false,
  focusBlock: {
    id: "block-1",
    stageTitle: "Build a Safe Base",
    title: "Build simple sentences about yourself",
  },
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
      blockId: "block-1",
      blockTitle: "Build simple sentences about yourself",
      estimatedMinutes: 10,
      followUpQuestion: "Which sentence felt easiest to say?",
      id: "prompt-1",
      isActive: true,
      isRecommended: true,
      lastRecordedAt: 200,
      prepHint: "Write 4 key words before speaking.",
      promptText: "Record a short voice note introducing yourself.",
      slug: "simple-self-introduction",
      stageTitle: "Build a Safe Base",
      summary:
        "A confidence-first speaking prompt for saying basic personal information out loud.",
      targetDurationSeconds: 60,
      title: "Record a simple self-introduction",
    },
  ],
  reflectionLabel: "Felt easy",
  reflectionOptions: [
    {
      detail: "The prompt felt comfortable and the ideas came out smoothly.",
      label: "Felt easy",
      value: "felt_easy",
    },
  ],
  sessionSummary: {
    detail:
      "Reflection and transcript are captured. Save the session to record this speaking return locally.",
      label: "Reflection ready at 1m 12s",
  },
  transcriptDraft: "I am Sara. I am from Izmir. I like reading and walking in the evening.",
  transcriptSummary: {
    detail:
      "This transcript is ready for a future clarity and feedback pass, even if it is not perfectly edited.",
    label: "Transcript draft ready",
    wordCount: 14,
  },
  workspaceError: null,
};

vi.mock("../model/use-speaking-workspace", () => ({
  useSpeakingWorkspace: () => mockWorkspace,
}));

vi.mock("@/shared/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true,
}));

describe("SpeakingOverview", () => {
  test("renders the speaking reflection save flow", () => {
    render(<SpeakingOverview content={buildContentStub()} />);

    expect(screen.getByText("Local session flow")).toBeInTheDocument();
    expect(screen.getByText("Local practice history")).toBeInTheDocument();
    expect(screen.getByText("Reflection before save")).toBeInTheDocument();
    expect(screen.getByText("Transcript view")).toBeInTheDocument();
    expect(screen.getByLabelText("Transcript draft")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save speaking session/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear session/i })).toBeInTheDocument();
    expect(screen.getAllByText("Felt easy").length).toBeGreaterThan(0);
  });
});

function buildContentStub() {
  return {
    audienceLabel: "Adults",
    templateTitle: "English OS V1",
  } as Parameters<typeof SpeakingOverview>[0]["content"];
}
