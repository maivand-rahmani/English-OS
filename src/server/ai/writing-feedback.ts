import { getClient, getModel, isAiAvailable } from "./openai-client";
import {
  writingFeedbackSchema,
  type WritingFeedbackResult,
  type AiServiceError,
} from "./types";

export type WritingFeedbackInput = {
  learnerLevel: string;
  taskPrompt: string;
  learnerResponse: string;
  roadmapContext?: string;
};

function buildSystemPrompt(): string {
  return [
    "You are a calm, supportive writing coach for English learners.",
    "Analyze the learner's response against the task prompt.",
    "Focus on grammar accuracy, sentence structure, clarity, naturalness, vocabulary fit, and task completion.",
    "",
    "You MUST respond with ONLY a valid JSON object \u2014 no greetings, no markdown, no code fences, no surrounding text.",
    "The first character of your response must be {. The last character must be }.",
    "",
    "Example response format:",
    "{",
    '  "overallSummary": "The response addresses the task but needs tighter sentence control.",',
    '  "correctedVersion": "Corrected full text here, or null if no major errors.",',
    '  "keyIssues": [',
    '    { "title": "Grammar", "detail": "The verb in sentence 2 should be past tense." },',
    '    { "title": "Clarity", "detail": "Split the first sentence into two shorter ones." }',
    "  ],",
    '  "naturalnessSuggestions": ["Try starting one sentence with a transition word like However."],',
    '  "grammarNotes": ["Change the verb form in sentence 2 to past tense."],',
    '  "vocabularySuggestions": ["Replace the repeated word with a more precise alternative."],',
    '  "nextPracticeFocus": "Focus on using past tense consistently throughout the response.",',
    '  "detectedPatterns": [',
    '    { "label": "Tense consistency", "detail": "Switching between present and past tense in one paragraph." }',
    "  ]",
    "}",
    "",
    "Give specific, actionable feedback. Be direct and calm.",
    "Do not overload the learner with too many corrections.",
    "The learner should leave with a clear next step.",
  ].join("\n");
}

export async function getWritingFeedback(
  input: WritingFeedbackInput,
): Promise<{
  data: WritingFeedbackResult | null;
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
    `Task prompt: ${input.taskPrompt}`,
    input.roadmapContext ? `Roadmap context: ${input.roadmapContext}` : null,
    "Learner response:",
    input.learnerResponse,
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
        error: {
          code: "invalid_response",
          message: "AI returned an empty response.",
        },
      };
    }

    console.error("[ai:writing-feedback] Raw response:", rawContent.slice(0, 500));

    const parsed = extractJson(rawContent);

    if (!parsed) {
      return {
        data: null,
        error: {
          code: "invalid_response",
          message: "AI response was not valid JSON.",
        },
      };
    }

    const validated = writingFeedbackSchema.safeParse(parsed);

    if (!validated.success) {
      return {
        data: null,
        error: {
          code: "invalid_response",
          message: "AI response did not match expected format.",
        },
      };
    }

    return { data: validated.data, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        data: null,
        error: { code: "timeout", message: "AI request timed out." },
      };
    }

    console.error("[ai:writing-feedback] Provider error:", err);

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
