import { describe, expect, test } from "vitest";

import {
  countWords,
  getSubmissionSummary,
  getWordTargetGuidance,
  hasRevisionSinceSubmit,
} from "./writing-draft-helpers";

describe("writing-draft-helpers", () => {
  test("counts words from learner text", () => {
    expect(countWords("  Write six short sentences about yourself. ")).toBe(6);
    expect(countWords("")).toBe(0);
  });

  test("describes progress toward the suggested word range", () => {
    expect(getWordTargetGuidance(18, 45, 80)).toBe(
      "27 more words to reach the suggested minimum.",
    );
    expect(getWordTargetGuidance(60, 45, 80)).toBe(
      "Inside the suggested task range.",
    );
    expect(getWordTargetGuidance(95, 45, 80)).toBe(
      "15 words over the suggested ceiling.",
    );
  });

  test("detects revisions after a submission", () => {
    expect(
      hasRevisionSinceSubmit({
        lastSubmittedAt: 100,
        updatedAt: 150,
      }),
    ).toBe(true);

    expect(
      hasRevisionSinceSubmit({
        lastSubmittedAt: 100,
        updatedAt: 100,
      }),
    ).toBe(false);
  });

  test("summarizes submission state for the workspace UI", () => {
    expect(
      getSubmissionSummary({
        lastSubmittedAt: undefined,
        lastWordCount: undefined,
        submissionCount: 0,
        updatedAt: 100,
      }),
    ).toEqual({
      detail: "Submit one attempt to unlock the next feedback loop.",
      label: "Not submitted yet",
    });

    expect(
      getSubmissionSummary({
        lastSubmittedAt: 100,
        lastWordCount: 72,
        submissionCount: 1,
        updatedAt: 100,
      }),
    ).toEqual({
      detail: "The latest local attempt is ready for feedback next.",
      label: "72 words submitted",
    });
  });
});
