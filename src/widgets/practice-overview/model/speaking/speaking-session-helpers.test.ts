import { describe, expect, test } from "vitest";

import {
  countTranscriptWords,
  formatSpeakingDuration,
  getReflectionLabel,
  getSpeakingSessionElapsed,
  getSpeakingSessionSummary,
  getTranscriptPreview,
  getTranscriptSummary,
} from "./speaking-session-helpers";

describe("speaking-session-helpers", () => {
  test("calculates live elapsed time for an active session", () => {
    expect(
      getSpeakingSessionElapsed(
        {
          createdAt: 100,
          elapsedSeconds: 75,
          id: "session-1",
          lastResumedAt: 1_000,
          promptId: "prompt-1",
          promptTitle: "Talk about your day",
          reflection: null,
          status: "active",
          transcriptDraft: "",
          updatedAt: 100,
        },
        6_200,
      ),
    ).toBe(80);
  });

  test("formats short and long speaking durations", () => {
    expect(formatSpeakingDuration(45)).toBe("45s");
    expect(formatSpeakingDuration(120)).toBe("2m");
    expect(formatSpeakingDuration(95)).toBe("1m 35s");
  });

  test("summarizes the current speaking session state", () => {
    expect(getSpeakingSessionSummary(null, 0)).toEqual({
      detail:
        "Start one speaking return to track time, pause if needed, then save a short reflection.",
      label: "No active session",
    });

    expect(
      getSpeakingSessionSummary(
        {
          createdAt: 100,
          elapsedSeconds: 90,
          id: "session-1",
          lastResumedAt: null,
          promptId: "prompt-1",
          promptTitle: "Talk about your day",
          reflection: "felt_easy",
          status: "reflecting",
          transcriptDraft: "",
          updatedAt: 100,
        },
        90,
      ),
    ).toEqual({
      detail:
        "Reflection is captured. Add a rough transcript or save the session when you are ready.",
      label: "Reflection ready at 1m 30s",
    });
  });

  test("maps a reflection value to its display label", () => {
    expect(getReflectionLabel("vocabulary_missing")).toBe("Vocabulary missing");
    expect(getReflectionLabel(null)).toBeNull();
  });

  test("counts transcript words and summarizes transcript readiness", () => {
    expect(countTranscriptWords("I talked about my work and my weekend plans.")).toBe(9);
    expect(getTranscriptSummary("")).toEqual({
      detail:
        "Add a rough transcript after speaking so future transcript-based feedback has a clean place to start.",
      label: "No transcript yet",
      wordCount: 0,
    });
    expect(getTranscriptSummary("I talked about my work and my weekend plans.")).toEqual({
      detail:
        "Even a rough transcript is useful. Add one or two more lines if the answer was longer than this.",
      label: "Short transcript draft",
      wordCount: 9,
    });
  });

  test("builds a clipped transcript preview", () => {
    expect(getTranscriptPreview("")).toBeNull();
    expect(
      getTranscriptPreview(
        "I talked about my work and my weekend plans in simple English because that felt easier for me today.",
        8,
      ),
    ).toBe("I talked about my work and my weekend...");
  });
});
