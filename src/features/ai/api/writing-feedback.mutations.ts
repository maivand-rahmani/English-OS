/**
 * Writing Feedback Mutation
 *
 * TanStack Query mutation for the writing feedback AI endpoint.
 * Replaces the raw `fetch('/api/ai/writing-feedback', ...)` call in
 * `src/widgets/practice-overview/model/writing/use-writing-workspace.ts`.
 *
 * The mutation accepts an `AbortSignal` via the `signal` field so consumers
 * can cancel in-flight requests when the user navigates away or submits a
 * newer feedback request. Pass the signal in like:
 *
 * ```ts
 * const controller = new AbortController();
 * mutation.mutate({ payload, signal: controller.signal });
 * controller.abort(); // cancels the request
 * ```
 *
 * AI feedback is expensive, so retries are disabled (`retry: 0`).
 * Network mode is `offlineFirst` to enqueue/respect online state.
 */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import type { WritingFeedbackResult } from "@/server/ai/types";

export type WritingFeedbackRequest = {
  learnerLevel: string;
  taskPrompt: string;
  learnerResponse: string;
  roadmapContext?: unknown;
};

export type WritingFeedbackResponse = WritingFeedbackResult;

type WritingFeedbackApiSuccess = {
  ok: true;
  data: WritingFeedbackResponse;
};

type WritingFeedbackApiFailure = {
  ok: false;
  error: { code: string; message: string };
};

type WritingFeedbackApiResponse =
  | WritingFeedbackApiSuccess
  | WritingFeedbackApiFailure;

type WritingFeedbackMutationVariables = {
  payload: WritingFeedbackRequest;
  signal?: AbortSignal;
};

async function postWritingFeedback(
  variables: WritingFeedbackMutationVariables,
): Promise<WritingFeedbackResponse> {
  const { payload, signal } = variables;

  const res = await fetch("/api/ai/writing-feedback", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as WritingFeedbackApiResponse;

  if (!data.ok) {
    throw new Error(data.error?.message ?? "AI feedback failed");
  }

  return data.data;
}

/**
 * Mutation hook for requesting writing feedback from the AI service.
 *
 * @returns TanStack Query mutation result. Use `mutation.mutate({ payload, signal })`
 *          to trigger, `mutation.isPending` to render loading state, and
 *          `mutation.error` to render failure state.
 */
export function useWritingFeedbackMutation(): UseMutationResult<
  WritingFeedbackResponse,
  Error,
  WritingFeedbackMutationVariables
> {
  return useMutation<
    WritingFeedbackResponse,
    Error,
    WritingFeedbackMutationVariables
  >({
    mutationFn: postWritingFeedback,
    onError: (err) => {
      console.error("[writing-feedback]", err);
    },
    retry: 0,
    networkMode: "offlineFirst",
  });
}
