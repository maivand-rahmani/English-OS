import { describe, expect, test } from "vitest";

import { getWritingFeedbackPreview } from "./writing-feedback-preview";

describe("writing-feedback-preview", () => {
  test("stays hidden before the learner submits a draft", () => {
    expect(
      getWritingFeedbackPreview({
        content: "i like reading books",
        draft: {
          lastSubmittedAt: undefined,
          lastWordCount: undefined,
          updatedAt: 100,
        },
        task: {
          instructions: "Write a short paragraph about your weekly reading habit.",
          successCriteria: null,
          title: "Reading habit paragraph",
          wordCountMax: 80,
          wordCountMin: 45,
        },
        wordCount: 4,
      }),
    ).toBeNull();
  });

  test("builds feedback notes for an under-length submission with sentence issues", () => {
    const preview = getWritingFeedbackPreview({
      content: "i like reading because it is calm and i read every day",
      draft: {
        lastSubmittedAt: 100,
        lastWordCount: 11,
        updatedAt: 100,
      },
      task: {
        instructions: "Write a short paragraph about your weekly reading habit.",
        successCriteria: "Explain the habit clearly and include one personal detail.",
        title: "Reading habit paragraph",
        wordCountMax: 80,
        wordCountMin: 45,
      },
      wordCount: 11,
    });

    expect(preview).not.toBeNull();
    expect(preview?.statusLabel).toBe("Feedback ready");
    expect(preview?.keyIssues.map((issue) => issue.title)).toContain("Task completion");
    expect(preview?.grammarNotes).toContain(
      "Add a full stop, question mark, or exclamation mark at the end of the response.",
    );
    expect(preview?.grammarNotes).toContain('Change the standalone pronoun "i" to "I".');
    expect(preview?.nextPracticeFocus).toContain("Finish the task completely");
    expect(preview?.correctedVersion).toBe(
      "I like reading because it is calm and I read every day.",
    );
  });

  test("switches into revision state and flags repetition patterns after edits", () => {
    const preview = getWritingFeedbackPreview({
      content:
        "Travel helps me learn new ideas. Travel helps me meet new people. Travel helps me feel more open to different routines",
      draft: {
        lastSubmittedAt: 100,
        lastWordCount: 18,
        updatedAt: 180,
      },
      task: {
        instructions: "Write about why travel matters to you.",
        successCriteria: null,
        title: "Travel reflection",
        wordCountMax: 90,
        wordCountMin: 40,
      },
      wordCount: 18,
    });

    expect(preview?.statusLabel).toBe("Revision in progress");
    expect(preview?.detectedPatterns.some((pattern) => pattern.label.includes("Repeated"))).toBe(
      true,
    );
    expect(preview?.naturalnessSuggestions.some((note) => note.includes('begin with "travel"'))).toBe(
      true,
    );
    expect(preview?.revisionChecklist.length).toBeGreaterThan(0);
  });
});
