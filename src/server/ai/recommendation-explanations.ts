import { getClient, getModel, isAiAvailable } from "./openai-client";
import {
  recommendationExplanationSchema,
  type RecommendationExplanationResult,
  type AiServiceError,
} from "./types";

export type RecommendationExplanationInput = {
  learnerLevel: string;
  learnerGoal: string;
  activeStageTitle: string;
  recommendedAction: string;
  relatedSkill: string;
  recentSignal?: string;
};

function buildSystemPrompt(): string {
  return [
    "You are a learning assistant for English OS.",
    "Given the learner's goal, current stage, the recommended action, the related skill, and optional recent signals,",
    "explain concisely why this action was recommended.",
    "",
    "You MUST respond with ONLY a valid JSON object \u2014 no greetings, no markdown, no code fences, no surrounding text.",
    "The first character of your response must be {. The last character must be }.",
    "",
    "Example response format:",
    "{",
    '  "explanation": "This resource supports your current grammar focus and was chosen because you marked the last related exercise as difficult.",',
    '  "confidence": "high"',
    "}",
    "",
    "Keep the explanation under 2 sentences.",
    "Tie the explanation to the system state. Do not invent resources or override system decisions.",
    'confidence must be exactly "high", "medium", or "low".',
  ].join("\n");
}

export async function getRecommendationExplanation(
  input: RecommendationExplanationInput,
): Promise<{
  data: RecommendationExplanationResult | null;
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
    `Learner goal: ${input.learnerGoal}`,
    `Active stage: ${input.activeStageTitle}`,
    `Recommended action: ${input.recommendedAction}`,
    `Related skill: ${input.relatedSkill}`,
    input.recentSignal ? `Recent signal: ${input.recentSignal}` : null,
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
        temperature: 0.3,
      },
      { signal: AbortSignal.timeout(15000) },
    );

    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      return {
        data: null,
        error: { code: "invalid_response", message: "AI returned an empty response." },
      };
    }

    console.error("[ai:recommendation] Raw response:", rawContent.slice(0, 500));

    const parsed = extractJson(rawContent);

    if (!parsed) {
      return {
        data: null,
        error: { code: "invalid_response", message: "AI response was not valid JSON." },
      };
    }

    const validated = recommendationExplanationSchema.safeParse(parsed);

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

    console.error("[ai:recommendation] Provider error:", err);

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
