import { describe, expect, test } from "vitest";

import type { DashboardContentState } from "@/entities/dashboard";
import type { DraftSummary, ProgressEntry } from "@/shared/types";

import {
  getPreferredWritingTask,
  getWritingWorkspaceState,
} from "./writing-workspace-state";

describe("writing-workspace-state", () => {
  test("prefers a drafted task in the focus block", () => {
    const content = buildContentStub();
    const drafts: DraftSummary[] = [
      {
        id: "draft-2",
        taskId: "task-2",
        title: "Describe your typical day",
        updatedAt: 200,
      },
    ];
    const entries: ProgressEntry[] = [
      {
        entryType: "block",
        id: "block-1",
        state: "completed",
        updatedAt: 100,
      },
    ];

    const state = getWritingWorkspaceState(content, entries, drafts);

    expect(state.focusBlock?.id).toBe("block-2");
    expect(state.activeTask?.id).toBe("task-2");
    expect(state.tasks[0]).toMatchObject({
      id: "task-2",
      isActive: true,
      isRecommended: true,
    });
    expect(state.activeDraft?.id).toBe("draft-2");
  });

  test("keeps a manually selected task active even when another task has a draft", () => {
    const content = buildContentStub();
    const drafts: DraftSummary[] = [
      {
        id: "draft-2",
        taskId: "task-2",
        title: "Describe your typical day",
        updatedAt: 200,
      },
    ];

    const state = getWritingWorkspaceState(content, [], drafts, "task-1");

    expect(state.activeTask?.id).toBe("task-1");
    expect(state.tasks[0]).toMatchObject({
      id: "task-1",
      isActive: true,
    });
    expect(state.tasks[1]).toMatchObject({
      id: "task-2",
      isActive: false,
    });
  });

  test("falls back to the focus block task before the first task in the list", () => {
    const content = buildContentStub();
    const tasks = content.stages.flatMap((stage) =>
      stage.blocks.flatMap((block) =>
        block.writingTasks.map((task) => ({
          ...task,
          blockId: block.id,
          stageTitle: block.stageTitle,
        })),
      ),
    );
    const drafts: DraftSummary[] = [];

    expect(getPreferredWritingTask(tasks, "block-2", drafts)?.id).toBe("task-2");
  });
});

function buildContentStub(): DashboardContentState {
  return {
    audienceLabel: "Beginner self-learner",
    blockCount: 2,
    estimatedWeeks: 4,
    goalLabel: "Build a clear writing rhythm.",
    learnerLevelLabel: "A1",
    resourceCount: 0,
    stageCount: 1,
    stages: [
      {
        blocks: [
          {
            blockTypeLabel: "practice block",
            cefrLabel: "A1",
            id: "block-1",
            recommendedSessionCount: 2,
            resources: [],
            skills: [],
            slug: "introductions",
            speakingPrompts: [],
            stageId: "stage-1",
            stageSummary: "Build a daily output habit.",
            stageTitle: "Foundation",
            stageTypeLabel: "foundation stage",
            summary: "Simple introduction work.",
            title: "Introduce yourself",
            purpose: null,
            whyNow: null,
            estimatedMinutes: 15,
            writingTasks: [
              {
                blockTitle: "Introduce yourself",
                estimatedMinutes: 15,
                id: "task-1",
                instructions: "Write six simple sentences about yourself.",
                slug: "introduce-yourself",
                successCriteria: "Clear identity, place, routine, and one goal.",
                summary: "Low-pressure introduction practice.",
                title: "Introduce yourself in six sentences",
                wordCountMax: 80,
                wordCountMin: 45,
              },
            ],
          },
          {
            blockTypeLabel: "practice block",
            cefrLabel: "A1 to A2",
            id: "block-2",
            recommendedSessionCount: 2,
            resources: [],
            skills: [],
            slug: "routine",
            speakingPrompts: [],
            stageId: "stage-1",
            stageSummary: "Build a daily output habit.",
            stageTitle: "Foundation",
            stageTypeLabel: "foundation stage",
            summary: "Routine writing work.",
            title: "Describe your routine",
            purpose: null,
            whyNow: null,
            estimatedMinutes: 20,
            writingTasks: [
              {
                blockTitle: "Describe your routine",
                estimatedMinutes: 20,
                id: "task-2",
                instructions: "Write a short paragraph about your daily routine.",
                slug: "describe-routine",
                successCriteria: "A connected paragraph with a clear sequence.",
                summary: "Routine vocabulary in connected writing.",
                title: "Describe your typical day",
                wordCountMax: 120,
                wordCountMin: 70,
              },
            ],
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
