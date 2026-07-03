import { getClient, getModel, isAiAvailable } from "./openai-client";
import {
  speakingFeedbackSchema,
  type SpeakingFeedbackResult,
  type AiServiceError,
} from "./types";

export type SpeakingFeedbackInput = {
  learnerLevel: string;
  promptText: string;
  transcript: string;
  learnerReflection?: string;
  roadmapContext?: string;
};

function buildSystemPrompt(): string {
  return [
    "You are a supportive speaking coach for English learners.",
    "Analyze the learner's spoken transcript against the speaking prompt.",
    "Focus on clarity, grammar in spoken output, vocabulary fit, answer structure, and fluency.",
    "",
    "You MUST respond with ONLY a valid JSON object \u2014 no greetings, no markdown, no code fences, no surrounding text.",
    "The first character of your response must be {. The last character must be }.",
    "",
    "Verdict guidelines:",
    "- \"pass\" \u2014 The transcript fully addresses the prompt with only minor slips. The learner is ready to move on.",
    "- \"retry\" \u2014 The transcript attempts the prompt but has significant issues (off-prompt, hard to follow, repeated breakdowns). The learner should try again on the same prompt.",
    "- \"needs_work\" \u2014 The transcript is between pass and retry. The learner could move on but would benefit from another attempt first.",
    "",
    "Example response format:",
    "{",
    '  "verdict": "pass",',
    '  "feedbackSummary": "You stayed on topic and answered with a clear structure. Ready for the next prompt.",',
    '  "overallSummary": "The response answered the prompt but pauses before key words suggest vocabulary hesitation.",',
    '  "clarityFeedback": "The main idea was clear, but the second sentence felt rushed and lost focus.",',
    '  "grammarFeedback": "Subject-verb agreement was mostly correct. One tense slip in the third sentence.",',
    '  "vocabularyFeedback": "Good basic vocabulary, but repeating the same adjective twice made the response sound limited.",',
    '  "fluencyFeedback": "The flow was steady until the final sentence where a long pause broke the rhythm.",',
    '  "strongerResponseExample": "A rewritten version showing smoother transitions between ideas.",',
    '  "nextPracticeFocus": "Practice speaking the same answer again, focusing on connecting sentences with transition words.",',
    '  "detectedPatterns": [',
    '    { "label": "Filler words", "detail": "Repeated use of um and uh in the first half of the response." }',
    "  ],",
    '  "confidenceNote": "You picked a clear structure and stayed on topic. One more practice round with smoother transitions and this will sound very natural."',
    "}",
    "",
    "Be encouraging and specific. Identify 1-2 concrete improvements.",
    "Make the next session feel possible. Do not make the learner feel punished.",
    "feedbackSummary must be one or two short sentences summarizing the verdict for the learner.",
  ].join("\n");
}

export async function getSpeakingFeedback(
  input: SpeakingFeedbackInput,
): Promise<{
  data: SpeakingFeedbackResult | null;
  error: AiServiceError | null;
}> {
  if (!isAiAvailable()) {
    return {
      data: null,
      error: { code: "unavailable", message: "AI is not configured." },
    };
  }

  const userPrompt = [
    `Learner level: ${input.learnerLevel}`,
    `Speaking prompt: ${input.promptText}`,
    input.learnerReflection
      ? `Learner reflection: ${input.learnerReflection}`
      : null,
    input.roadmapContext ? `Roadmap context: ${input.roadmapContext}` : null,
    "Transcript:",
    input.transcript,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await getClient()!.chat.completions.create(
      {
        model: getModel(),
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      },
      { signal: AbortSignal.timeout(30000) },
    );

    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      return {
        data: null,
        error: { code: "invalid_response", message: "AI returned an empty response." },
      };
    }

    console.error("[ai:speaking-feedback] Raw response:", rawContent.slice(0, 500));

    const parsed = extractJson(rawContent);

    if (!parsed) {
      return {
        data: null,
        error: { code: "invalid_response", message: "AI response was not valid JSON." },
      };
    }

    const validated = speakingFeedbackSchema.safeParse(parsed);

    if (!validated.success) {
      return {
        data: null,
        error: { code: "invalid_response", message: "AI response did not match expected format." },
      };
    }

    return { data: validated.data, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { data: null, error: { code: "timeout", message: "AI request timed out." } };
    }

    console.error("[ai:speaking-feedback] Provider error:", err);

    return {
      data: null,
      error: { code: "provider_error", message: "AI provider returned an error." },
    };
  }
}

function extractJson(raw: string): unknown | null {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    void 0;
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      void 0;
    }
  }

  const braceMatch = trimmed.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      void 0;
    }
  }

  return null;
}
