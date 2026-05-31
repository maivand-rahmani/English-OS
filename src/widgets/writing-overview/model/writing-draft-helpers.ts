import type { Draft, DraftSummary } from "@/shared/types";

export function countWords(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

export function getWordTargetGuidance(
  wordCount: number,
  min: number | null | undefined,
  max: number | null | undefined,
) {
  if (!min && !max) {
    return "Flexible length";
  }

  if (min && wordCount < min) {
    return `${min - wordCount} more words to reach the suggested minimum.`;
  }

  if (max && wordCount > max) {
    return `${wordCount - max} words over the suggested ceiling.`;
  }

  if (min && max) {
    return "Inside the suggested task range.";
  }

  if (min) {
    return "You have reached the suggested minimum.";
  }

  return "Inside the suggested length.";
}

export function hasRevisionSinceSubmit(
  draft: Pick<Draft, "lastSubmittedAt" | "updatedAt"> | undefined,
) {
  return Boolean(draft?.lastSubmittedAt && draft.updatedAt > draft.lastSubmittedAt);
}

export function getSubmissionSummary(
  draft: Pick<
    DraftSummary,
    "lastSubmittedAt" | "lastWordCount" | "submissionCount" | "updatedAt"
  >,
) {
  if (!draft.lastSubmittedAt) {
    return {
      detail: "Submit one attempt to unlock the next feedback loop.",
      label: "Not submitted yet",
    };
  }

  if (hasRevisionSinceSubmit(draft)) {
    return {
      detail: "This draft changed after the last submission and is ready for another pass.",
      label: "Revised after submit",
    };
  }

  return {
    detail:
      draft.submissionCount && draft.submissionCount > 1
        ? "Multiple local attempts are now stacked on this task."
        : "The latest local attempt is ready for feedback next.",
    label: draft.lastWordCount
      ? `${draft.lastWordCount} words submitted`
      : "Submission recorded",
  };
}
