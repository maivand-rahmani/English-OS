/**
 * Speaking Feedback Mutation
 *
 * TanStack Query mutation for the speaking feedback AI endpoint.
 * Replaces the two raw `fetch('/api/ai/speaking-feedback', ...)` calls in
 * `src/widgets/practice-overview/model/speaking/use-speaking-workspace.ts`
 * (line 299 — after session save, line 398 — on-demand request).
 *
 * The endpoint accepts two distinct feedback operations that share the same
 * route. A **discriminated union** (keyed on `type`) is the cleanest way to
 * model this in TypeScript: each branch carries only the fields it needs and
 * the compiler enforces that callers don't mix them up.
 *
 *   - `type: 'initial'`     — analyze a fresh transcript against the prompt
 *   - `type: 'reflection'`  — re-evaluate the original transcript with the
 *                              learner's reflection added
 *
 * Example:
 * ```ts
 * // initial feedback
 * mutation.mutate({
 *   payload: {
 *     type: "initial",
 *     prompt: activePrompt.promptText,
 *     transcript: capturedTranscript,
 *     learnerLevel: content.learnerLevelLabel ?? "Beginner",
 *   },
 *   signal: controller.signal,
 * });
 *
 * // reflection feedback
 * mutation.mutate({
 *   payload: {
 *     type: "reflection",
 *     prompt: activePrompt.promptText,
 *     learnerReflection: reflectionLabel,
 *     originalTranscript: capturedTranscript,
 *     learnerLevel: content.learnerLevelLabel ?? "Beginner",
 *   },
 *   signal: controller.signal,
 * });
 * ```
 *
 * The mutation accepts an `AbortSignal` via the `signal` field so consumers
 * can cancel in-flight requests when the user navigates away or submits a
 * newer feedback request.
 *
 * AI feedback is expensive, so retries are disabled (`retry: 0`).
 * Network mode is `offlineFirst` to enqueue/respect online state.
 */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import type { SpeakingFeedbackResult } from "@/server/ai/types";

/**
 * Discriminated union for the two speaking-feedback operations the API
 * supports. The `type` field is the discriminator — TypeScript will narrow
 * the union based on it, so each branch only exposes the fields it needs.
 */
export type SpeakingFeedbackRequest =
  | {
      type: "initial";
      prompt: string;
      transcript: string;
      learnerLevel: string;
    }
  | {
      type: "reflection";
      prompt: string;
      learnerReflection: string;
      originalTranscript: string;
      learnerLevel: string;
    };

export type SpeakingFeedbackResponse = SpeakingFeedbackResult;

type SpeakingFeedbackApiSuccess = {
  ok: true;
  data: SpeakingFeedbackResponse;
};

type SpeakingFeedbackApiFailure = {
  ok: false;
  error: { code: string; message: string };
};

type SpeakingFeedbackApiResponse =
  | SpeakingFeedbackApiSuccess
  | SpeakingFeedbackApiFailure;

type SpeakingFeedbackMutationVariables = {
  payload: SpeakingFeedbackRequest;
  signal?: AbortSignal;
};

function toApiBody(payload: SpeakingFeedbackRequest): Record<string, unknown> {
  const common = {
    learnerLevel: payload.learnerLevel,
    promptText: payload.prompt,
  };

  switch (payload.type) {
    case "initial":
      return {
        ...common,
        transcript: payload.transcript,
      };
    case "reflection":
      return {
        ...common,
        transcript: payload.originalTranscript,
        learnerReflection: payload.learnerReflection,
      };
  }
}

async function postSpeakingFeedback(
  variables: SpeakingFeedbackMutationVariables,
): Promise<SpeakingFeedbackResponse> {
  const { payload, signal } = variables;

  const res = await fetch("/api/ai/speaking-feedback", {
    method: "POST",
    body: JSON.stringify(toApiBody(payload)),
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as SpeakingFeedbackApiResponse;

  if (!data.ok) {
    throw new Error(data.error?.message ?? "AI speaking feedback failed");
  }

  return data.data;
}

/**
 * Mutation hook for requesting speaking feedback from the AI service.
 *
 * Both initial and reflection feedback share this hook — the
 * {@link SpeakingFeedbackRequest} discriminated union tells the server which
 * shape to use.
 *
 * @returns TanStack Query mutation result. Use `mutation.mutate({ payload, signal })`
 *          to trigger, `mutation.isPending` to render loading state, and
 *          `mutation.error` to render failure state.
 */
export function useSpeakingFeedbackMutation(): UseMutationResult<
  SpeakingFeedbackResponse,
  Error,
  SpeakingFeedbackMutationVariables
> {
  return useMutation<
    SpeakingFeedbackResponse,
    Error,
    SpeakingFeedbackMutationVariables
  >({
    mutationFn: postSpeakingFeedback,
    onError: (err) => {
      console.error("[speaking-feedback]", err);
    },
    retry: 0,
    networkMode: "offlineFirst",
  });
}
