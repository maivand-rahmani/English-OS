import { describe, expect, test } from "vitest";

import { getSpeakingHistorySnapshot } from "./speaking-history";

describe("speaking-history", () => {
  test("summarizes saved speaking returns and transcript continuity", () => {
    const snapshot = getSpeakingHistorySnapshot(
      [
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
        {
          id: "event-2",
          payload: {
            durationSeconds: 45,
            promptId: "prompt-1",
            sessionId: "session-2",
          },
          synced: false,
          timestamp: 150,
          type: "speaking_recorded",
        },
      ],
      new Map([["prompt-1", "Record a simple self-introduction"]]),
      [
        {
          detail: "The prompt felt comfortable and the ideas came out smoothly.",
          label: "Felt easy",
          value: "felt_easy",
        },
      ],
      300,
    );

    expect(snapshot.headline).toBe("2 speaking returns this week");
    expect(snapshot.detail).toBe("Latest confidence signal: Felt easy.");
    expect(snapshot.stats).toEqual({
      latestReflectionLabel: "Felt easy",
      repeatedPromptCount: 1,
      sessionsThisWeek: 2,
      totalDurationSeconds: 117,
      transcriptReadyCount: 1,
    });
    expect(snapshot.entries[0]).toMatchObject({
      hasTranscript: true,
      promptTitle: "Record a simple self-introduction",
      reflectionLabel: "Felt easy",
      transcriptWordCount: 15,
    });
  });

  test("returns an empty-state summary when no speaking history exists", () => {
    expect(getSpeakingHistorySnapshot([], new Map(), [], 10_000)).toEqual({
      detail:
        "Record one short speaking return to start building visible local continuity in this browser.",
      entries: [],
      headline: "No speaking history yet",
      stats: {
        latestReflectionLabel: null,
        repeatedPromptCount: 0,
        sessionsThisWeek: 0,
        totalDurationSeconds: 0,
        transcriptReadyCount: 0,
      },
    });
  });
});
