import type { Draft } from "@/shared/types";
import type { WritingTaskWithContext } from "@/widgets/dashboard-overview/model/dashboard-overview-types";

import { countWords, hasRevisionSinceSubmit } from "./writing-draft-helpers";

type FeedbackItem = {
  detail: string;
  title: string;
};

type FeedbackPattern = {
  detail: string;
  label: string;
};

export type WritingFeedbackPreview = {
  correctedVersion: string | null;
  detectedPatterns: FeedbackPattern[];
  grammarNotes: string[];
  keyIssues: FeedbackItem[];
  naturalnessSuggestions: string[];
  nextPracticeFocus: string;
  overallSummary: string;
  revisionChecklist: string[];
  statusLabel: string;
  vocabularySuggestions: string[];
};

type FeedbackDraft = Pick<
  Draft,
  "lastSubmittedAt" | "lastWordCount" | "updatedAt"
>;

type FeedbackTask = Pick<
  WritingTaskWithContext,
  "instructions" | "successCriteria" | "title" | "wordCountMax" | "wordCountMin"
>;

type WritingFeedbackPreviewInput = {
  content: string;
  draft: FeedbackDraft | null | undefined;
  task: FeedbackTask | null;
  wordCount: number;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "for",
  "from",
  "have",
  "has",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "we",
  "with",
  "you",
]);

export function getWritingFeedbackPreview({
  content,
  draft,
  task,
  wordCount,
}: WritingFeedbackPreviewInput): WritingFeedbackPreview | null {
  if (!draft?.lastSubmittedAt) {
    return null;
  }

  const trimmedContent = content.trim();
  const sentences = splitSentences(trimmedContent);
  const sentenceLengths = sentences.map((sentence) => countWords(sentence));
  const longestSentence = Math.max(0, ...sentenceLengths);
  const paragraphCount = countParagraphs(trimmedContent);
  const hasTerminalPunctuation = /[.!?]["')\]]?$/.test(trimmedContent);
  const hasSentenceStartLowercase = sentences.some((sentence) => {
    const firstCharacter = sentence.trim().charAt(0);
    return /^[a-z]/.test(firstCharacter);
  });
  const hasLowercaseStandaloneI = /\bi\b/.test(trimmedContent);
  const repeatedWords = getRepeatedWords(trimmedContent);
  const repeatedSentenceStart = getRepeatedSentenceStart(sentences);
  const lexicalVariety = getLexicalVariety(trimmedContent);
  const revisionStarted = hasRevisionSinceSubmit(draft);
  const min = task?.wordCountMin ?? null;
  const max = task?.wordCountMax ?? null;
  const lengthDelta = min && wordCount < min ? min - wordCount : 0;

  const keyIssues: FeedbackItem[] = [];

  if (lengthDelta > 0) {
    keyIssues.push({
      title: "Task completion",
      detail: `${lengthDelta} more words would help this response fully answer the task.`,
    });
  } else if (max && wordCount > max) {
    keyIssues.push({
      title: "Length control",
      detail: `${wordCount - max} words can likely be trimmed without losing the main idea.`,
    });
  }

  if (!hasTerminalPunctuation || hasSentenceStartLowercase || hasLowercaseStandaloneI) {
    keyIssues.push({
      title: "Sentence control",
      detail:
        "Tighten punctuation and capitalization so each sentence lands clearly.",
    });
  }

  if (sentences.length <= 1 && wordCount >= 24) {
    keyIssues.push({
      title: "Structure",
      detail:
        "Break this into at least two sentences so the reader can follow each idea more easily.",
    });
  } else if (longestSentence >= 26) {
    keyIssues.push({
      title: "Clarity",
      detail: "One sentence is doing too much. Split the longest idea into two shorter parts.",
    });
  }

  if (repeatedWords[0] && repeatedWords[0].count >= 3) {
    keyIssues.push({
      title: "Word repetition",
      detail: `The word "${repeatedWords[0].word}" appears ${repeatedWords[0].count} times and can be varied.`,
    });
  }

  if (paragraphCount === 1 && wordCount >= 90) {
    keyIssues.push({
      title: "Paragraph flow",
      detail: "Split the draft into two short paragraphs to make the response easier to scan.",
    });
  }

  const grammarNotes: string[] = [];

  if (!hasTerminalPunctuation) {
    grammarNotes.push("Add a full stop, question mark, or exclamation mark at the end of the response.");
  }

  if (hasSentenceStartLowercase) {
    grammarNotes.push("Capitalize the first word of each new sentence.");
  }

  if (hasLowercaseStandaloneI) {
    grammarNotes.push('Change the standalone pronoun "i" to "I".');
  }

  if (grammarNotes.length === 0) {
    grammarNotes.push("Sentence boundaries look stable, so the next pass can focus more on clarity than basic fixes.");
  }

  const naturalnessSuggestions: string[] = [];

  if (paragraphCount === 1 && wordCount >= 70) {
    naturalnessSuggestions.push("Split the answer into two short paragraphs to create a more natural reading rhythm.");
  }

  if (repeatedSentenceStart) {
    naturalnessSuggestions.push(
      `Too many sentences begin with "${repeatedSentenceStart}". Vary the opening words so the response sounds less repetitive.`,
    );
  }

  if (longestSentence >= 22) {
    naturalnessSuggestions.push("Read the longest sentence aloud and cut it where you naturally pause.");
  }

  if (naturalnessSuggestions.length === 0) {
    naturalnessSuggestions.push("Add one concrete detail or example so the response sounds more personal and specific.");
  }

  const vocabularySuggestions: string[] = [];

  if (repeatedWords[0]) {
    vocabularySuggestions.push(
      `Replace one or two uses of "${repeatedWords[0].word}" with a more precise alternative.`,
    );
  }

  if (lexicalVariety < 0.52 && wordCount >= 24) {
    vocabularySuggestions.push(
      "Try swapping one common adjective or verb for a more specific word that still feels easy to use.",
    );
  }

  if (vocabularySuggestions.length === 0) {
    vocabularySuggestions.push("Keep the vocabulary simple, but upgrade one key noun or verb to make the idea sharper.");
  }

  const detectedPatterns: FeedbackPattern[] = [];

  if (lengthDelta > 0) {
    detectedPatterns.push({
      label: "Under target length",
      detail: `${lengthDelta} more words would help the answer feel complete.`,
    });
  }

  if (!hasTerminalPunctuation) {
    detectedPatterns.push({
      label: "Missing final punctuation",
      detail: "The draft ends without a strong sentence ending.",
    });
  }

  if (repeatedWords[0]) {
    detectedPatterns.push({
      label: `Repeated "${repeatedWords[0].word}"`,
      detail: `${repeatedWords[0].count} uses detected in the current draft.`,
    });
  }

  if (paragraphCount === 1 && wordCount >= 70) {
    detectedPatterns.push({
      label: "Single-block response",
      detail: "The whole answer currently sits in one paragraph.",
    });
  }

  if (detectedPatterns.length === 0) {
    detectedPatterns.push({
      label: "Ready for rewrite",
      detail: "The local checks look calm enough for a lighter clarity pass.",
    });
  }

  const nextPracticeFocus = getNextPracticeFocus({
    hasLowercaseStandaloneI,
    hasSentenceStartLowercase,
    lengthDelta,
    longestSentence,
    max,
    min,
    paragraphCount,
    repeatedWord: repeatedWords[0]?.word,
    task,
    trimmedContent,
    wordCount,
  });

  const revisionChecklist = getRevisionChecklist({
    hasTerminalPunctuation,
    hasLowercaseStandaloneI,
    hasSentenceStartLowercase,
    lengthDelta,
    paragraphCount,
    repeatedWord: repeatedWords[0]?.word,
    wordCount,
  });

  return {
    correctedVersion: buildCorrectionPreview(trimmedContent),
    detectedPatterns,
    grammarNotes,
    keyIssues: keyIssues.slice(0, 3),
    naturalnessSuggestions: naturalnessSuggestions.slice(0, 3),
    nextPracticeFocus,
    overallSummary: getOverallSummary({
      keyIssueCount: keyIssues.length,
      lengthDelta,
      revisionStarted,
      wordCount,
    }),
    revisionChecklist,
    statusLabel: revisionStarted ? "Revision in progress" : "Feedback ready",
    vocabularySuggestions: vocabularySuggestions.slice(0, 3),
  };
}

function splitSentences(content: string) {
  return content
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function countParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean).length;
}

function getRepeatedWords(content: string) {
  const words = content.toLowerCase().match(/[a-z']+/g) ?? [];
  const counts = new Map<string, number>();

  for (const word of words) {
    if (word.length < 3 || STOP_WORDS.has(word)) {
      continue;
    }

    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((entry) => entry.count >= 3)
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word));
}

function getRepeatedSentenceStart(sentences: string[]) {
  const counts = new Map<string, number>();

  for (const sentence of sentences) {
    const firstWord = sentence.toLowerCase().match(/[a-z']+/)?.[0];

    if (!firstWord || firstWord.length < 2 || STOP_WORDS.has(firstWord)) {
      continue;
    }

    counts.set(firstWord, (counts.get(firstWord) ?? 0) + 1);
  }

  const repeated = [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((entry) => entry.count >= 3)
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word))[0];

  return repeated?.word ?? null;
}

function getLexicalVariety(content: string) {
  const words = content.toLowerCase().match(/[a-z']+/g) ?? [];

  if (words.length === 0) {
    return 1;
  }

  return new Set(words).size / words.length;
}

function getOverallSummary({
  keyIssueCount,
  lengthDelta,
  revisionStarted,
  wordCount,
}: {
  keyIssueCount: number;
  lengthDelta: number;
  revisionStarted: boolean;
  wordCount: number;
}) {
  if (revisionStarted) {
    return "You already revised after the last submission. Tighten the points below, then send the next version.";
  }

  if (lengthDelta > 0) {
    return "The idea is starting to land, but the response still needs a fuller answer before smaller edits matter.";
  }

  if (keyIssueCount >= 3) {
    return "This attempt has a clear base. The next improvement comes from cleaner sentence control and lighter repetition.";
  }

  if (wordCount >= 45) {
    return "The draft covers the task well enough to move into a targeted clarity pass.";
  }

  return "The first pass is usable. One focused rewrite should make it feel much more deliberate.";
}

function getNextPracticeFocus({
  hasLowercaseStandaloneI,
  hasSentenceStartLowercase,
  lengthDelta,
  longestSentence,
  max,
  min,
  paragraphCount,
  repeatedWord,
  task,
  trimmedContent,
  wordCount,
}: {
  hasLowercaseStandaloneI: boolean;
  hasSentenceStartLowercase: boolean;
  lengthDelta: number;
  longestSentence: number;
  max: number | null;
  min: number | null;
  paragraphCount: number;
  repeatedWord: string | undefined;
  task: FeedbackTask | null;
  trimmedContent: string;
  wordCount: number;
}) {
  if (lengthDelta > 0) {
    return "Finish the task completely before polishing. Add one more example, reason, or personal detail.";
  }

  if (max && wordCount > max) {
    return "Tighten the answer by cutting one repeated idea while keeping the strongest example.";
  }

  if (hasSentenceStartLowercase || hasLowercaseStandaloneI || !/[.!?]["')\]]?$/.test(trimmedContent)) {
    return "Clean up sentence endings and capitalization so every thought feels intentional.";
  }

  if (repeatedWord) {
    return `Replace repeated uses of "${repeatedWord}" with more precise language before the next submission.`;
  }

  if (paragraphCount === 1 && wordCount >= 70) {
    return "Split the draft into two short paragraphs so the answer breathes more naturally.";
  }

  if (longestSentence >= 22) {
    return "Shorten the longest sentence and let each sentence carry one clear idea.";
  }

  if (task?.successCriteria) {
    return task.successCriteria;
  }

  if (task?.instructions) {
    return `Revise once with the task in mind: ${task.instructions}`;
  }

  return min ? "Stay inside the task range and make one sentence more specific in the next pass." : "Keep the wording simple and add one stronger detail in the next pass.";
}

function getRevisionChecklist({
  hasTerminalPunctuation,
  hasLowercaseStandaloneI,
  hasSentenceStartLowercase,
  lengthDelta,
  paragraphCount,
  repeatedWord,
  wordCount,
}: {
  hasTerminalPunctuation: boolean;
  hasLowercaseStandaloneI: boolean;
  hasSentenceStartLowercase: boolean;
  lengthDelta: number;
  paragraphCount: number;
  repeatedWord: string | undefined;
  wordCount: number;
}) {
  const checklist: string[] = [];

  if (lengthDelta > 0) {
    checklist.push("Add one more sentence with a concrete reason, example, or detail.");
  }

  if (!hasTerminalPunctuation || hasSentenceStartLowercase || hasLowercaseStandaloneI) {
    checklist.push("Fix punctuation and capitalization before you judge the rest of the draft.");
  }

  if (repeatedWord) {
    checklist.push(`Swap one or two uses of "${repeatedWord}" for a more precise word.`);
  }

  if (paragraphCount === 1 && wordCount >= 70) {
    checklist.push("Split the response into two short paragraphs.");
  }

  if (checklist.length === 0) {
    checklist.push("Read the draft once out loud and shorten any sentence that feels heavy.");
    checklist.push("Add one more specific detail so the writing sounds more personal.");
  }

  return checklist.slice(0, 3);
}

function buildCorrectionPreview(content: string) {
  if (!content) {
    return null;
  }

  let preview = content.replace(/[ \t]+/g, " ").trim();

  preview = preview.replace(/\bi\b/g, "I");
  preview = preview.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
    void match;
    return `${prefix}${letter.toUpperCase()}`;
  });

  if (!/[.!?]["')\]]?$/.test(preview)) {
    preview = `${preview}.`;
  }

  return preview === content ? null : preview;
}
