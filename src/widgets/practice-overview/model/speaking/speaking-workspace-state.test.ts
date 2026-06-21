import { describe, expect, test } from "vitest";

import type { DashboardContentState } from "@/entities/dashboard";
import {
  LearningEventType,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";

import {
  getPreferredSpeakingPrompt,
  getSpeakingWorkspaceState,
} from "./speaking-workspace-state";

describe("speaking-workspace-state", () => {
  test("prefers a recently recorded prompt in the focus block", () => {
    const content = buildContentStub();
    const entries: ProgressEntry[] = [
      {
        entryType: "block",
        id: "block-1",
        state: "completed",
        updatedAt: 100,
      },
    ];
    const events: LearningEvent[] = [
      {
        id: "event-1",
        payload: {
          durationSeconds: 90,
          promptId: "prompt-2",
          sessionId: "session-1",
        },
        synced: false,
        timestamp: 200,
        type: LearningEventType.SpeakingRecorded,
      },
    ];

    const state = getSpeakingWorkspaceState(content, entries, events);

    expect(state.focusBlock?.id).toBe("block-2");
    expect(state.activePrompt?.id).toBe("prompt-2");
    expect(state.prompts[0]).toMatchObject({
      id: "prompt-2",
      isActive: true,
      isRecommended: true,
      lastRecordedAt: 200,
    });
  });

  test("keeps a manually selected prompt active even when another prompt has history", () => {
    const content = buildContentStub();
    const events: LearningEvent[] = [
      {
        id: "event-1",
        payload: {
          durationSeconds: 90,
          promptId: "prompt-2",
          sessionId: "session-1",
        },
        synced: false,
        timestamp: 200,
        type: LearningEventType.SpeakingRecorded,
      },
    ];

    const state = getSpeakingWorkspaceState(content, [], events, "prompt-1");

    expect(state.activePrompt?.id).toBe("prompt-1");
    expect(state.prompts[0]).toMatchObject({
      id: "prompt-1",
      isActive: true,
    });
    expect(state.prompts[1]).toMatchObject({
      id: "prompt-2",
      isActive: false,
    });
  });

  test("falls back to the focus block prompt before the first prompt in the list", () => {
    const content = buildContentStub();
    const prompts = content.stages.flatMap((stage) =>
      stage.blocks.flatMap((block) =>
        block.speakingPrompts.map((prompt) => ({
          ...prompt,
          blockId: block.id,
          stageTitle: block.stageTitle,
        })),
      ),
    );
    const events: LearningEvent[] = [];

    expect(getPreferredSpeakingPrompt(prompts, "block-2", events)?.id).toBe("prompt-2");
  });
});

function buildContentStub(): DashboardContentState {
  return {
    displayName: "Test User",
    audienceLabel: "Beginner self-learner",
    blockCount: 2,
    estimatedWeeks: 4,
    goalLabel: "Build a speaking rhythm.",
    learnerLevelLabel: "A1",
    resourceCount: 0,
    stageCount: 1,
    stages: [
      {
        blocks: [
          {
            blockTypeLabel: "practice block",
            cefrLabel: "A1",
            estimatedMinutes: 10,
            id: "block-1",
            purpose: null,
            recommendedSessionCount: 2,
            resources: [],
            skills: [],
            slug: "introductions",
            speakingPrompts: [
              {
                blockTitle: "Simple sentences about you",
                estimatedMinutes: 10,
                followUpQuestion: "Which sentence felt easiest to say?",
                id: "prompt-1",
                prepHint: "Write 4 key words before you start.",
                promptText: "Introduce yourself in a short voice note.",
                slug: "simple-self-introduction",
                summary: "Low-pressure speaking practice.",
                targetDurationSeconds: 60,
                title: "Record a simple self-introduction",
              },
            ],
            stageId: "stage-1",
            stageSummary: "Build a daily output habit.",
            stageTitle: "Foundation",
            stageTypeLabel: "foundation stage",
            summary: "Simple introduction work.",
            title: "Simple sentences about you",
            whyNow: null,
            writingTasks: [],
          },
          {
            blockTypeLabel: "practice block",
            cefrLabel: "A1 to A2",
            estimatedMinutes: 12,
            id: "block-2",
            purpose: null,
            recommendedSessionCount: 2,
            resources: [],
            skills: [],
            slug: "routine",
            speakingPrompts: [
              {
                blockTitle: "Describe your routine",
                estimatedMinutes: 12,
                followUpQuestion: "What part of the routine felt unclear?",
                id: "prompt-2",
                prepHint: "Think in 3 parts: morning, afternoon, evening.",
                promptText: "Talk for one minute about your normal day.",
                slug: "daily-routine",
                summary: "Routine vocabulary in connected speech.",
                targetDurationSeconds: 90,
                title: "Talk about your daily routine",
              },
            ],
            stageId: "stage-1",
            stageSummary: "Build a daily output habit.",
            stageTitle: "Foundation",
            stageTypeLabel: "foundation stage",
            summary: "Routine speaking work.",
            title: "Describe your routine",
            whyNow: null,
            writingTasks: [],
          },
        ],
        cefrLabel: "A1 to A2",
        estimatedWeeks: 4,
        id: "stage-1",
        purpose: null,
        slug: "foundation",
        stageTypeLabel: "foundation stage",
        summary: "Build a daily output habit.",
        title: "Foundation",
      },
    ],
    templateDescription: "A focused beginner path.",
    templateTitle: "Starter path",
  };
}
