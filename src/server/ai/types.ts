import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Writing feedback                                                   */
/* ------------------------------------------------------------------ */

export const writingFeedbackSchema = z.object({
  verdict: z.enum(["pass", "retry", "needs_work"]),
  feedbackSummary: z.string(),
  overallSummary: z.string(),
  correctedVersion: z.string().nullable(),
  keyIssues: z
    .array(z.object({ title: z.string(), detail: z.string() }))
    .max(4),
  naturalnessSuggestions: z.array(z.string()).max(4),
  grammarNotes: z.array(z.string()).max(4),
  vocabularySuggestions: z.array(z.string()).max(4),
  nextPracticeFocus: z.string(),
  detectedPatterns: z
    .array(z.object({ label: z.string(), detail: z.string() }))
    .max(4),
});

export type WritingFeedbackResult = z.infer<typeof writingFeedbackSchema>;

/* ------------------------------------------------------------------ */
/*  Speaking feedback                                                  */
/* ------------------------------------------------------------------ */

export const speakingFeedbackSchema = z.object({
  verdict: z.enum(["pass", "retry", "needs_work"]),
  feedbackSummary: z.string(),
  overallSummary: z.string(),
  clarityFeedback: z.string(),
  grammarFeedback: z.string(),
  vocabularyFeedback: z.string(),
  fluencyFeedback: z.string(),
  strongerResponseExample: z.string().nullable(),
  nextPracticeFocus: z.string(),
  detectedPatterns: z
    .array(z.object({ label: z.string(), detail: z.string() }))
    .max(4),
  confidenceNote: z.string(),
});

export type SpeakingFeedbackResult = z.infer<typeof speakingFeedbackSchema>;

/* ------------------------------------------------------------------ */
/*  Recommendation explanation                                         */
/* ------------------------------------------------------------------ */

export const recommendationExplanationSchema = z.object({
  explanation: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

export type RecommendationExplanationResult = z.infer<
  typeof recommendationExplanationSchema
>;

/* ------------------------------------------------------------------ */
/*  Shared error type                                                  */
/* ------------------------------------------------------------------ */

export type AiServiceError = {
  code: "unavailable" | "invalid_response" | "provider_error" | "timeout";
  message: string;
};
