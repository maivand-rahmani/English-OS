import { describe, expect, test } from "vitest";

import { getWritingHistorySnapshot } from "./writing-history";

describe("writing-history", () => {
  test("summarizes local drafts and recent submissions", () => {
    const snapshot = getWritingHistorySnapshot(
      [
        {
          id: "draft-1",
          lastSubmittedAt: 1_000,
          lastWordCount: 68,
          submissionCount: 2,
          taskId: "task-1",
          title: "Travel reflection",
          updatedAt: 1_200,
        },
        {
          id: "draft-2",
          title: "Work routine note",
          taskId: "task-2",
          updatedAt: 900,
        },
      ],
      [
        {
          id: "event-1",
          payload: {
            draftId: "draft-1",
            taskId: "task-1",
            wordCount: 68,
          },
          synced: false,
          timestamp: 1_000,
          type: "writing_submitted",
        },
      ],
      1_400,
    );

    expect(snapshot.headline).toBe("1 writing submission this week");
    expect(snapshot.detail).toBe("1 revision loop is still open locally.");
    expect(snapshot.stats).toEqual({
      draftsInProgress: 2,
      revisionsInProgress: 1,
      submissionsThisWeek: 1,
    });
    expect(snapshot.latestWordCount).toBe(68);
    expect(snapshot.entries.map((entry) => entry.statusLabel)).toEqual([
      "Revision in progress",
      "Draft in progress",
    ]);
  });

  test("returns an empty-state summary when no local history exists", () => {
    expect(getWritingHistorySnapshot([], [], 10_000)).toEqual({
      detail:
        "Start one draft and submit the first attempt to build local writing history in this browser.",
      entries: [],
      headline: "No writing history yet",
      latestSubmittedAt: null,
      latestWordCount: null,
      stats: {
        draftsInProgress: 0,
        revisionsInProgress: 0,
        submissionsThisWeek: 0,
      },
    });
  });
});
