/**
 * Recommendation Explain Mutation
 *
 * TanStack Query mutation for the recommendation explain AI endpoint.
 * Explains why a specific recommendation was made to the learner.
 *
 * Currently unused in the UI — created for API consistency and future
 * integration with the recommendation explain route.
 *
 * The mutation accepts an `AbortSignal` via the `signal` field so consumers
 * can cancel in-flight requests when the user navigates away or submits a
 * newer explain request. Pass the signal in like:
 *
 * ```ts
 * const controller = new AbortController();
 * mutation.mutate({ payload, signal: controller.signal });
 * controller.abort(); // cancels the request
 * ```
 *
 * AI feedback is expensive, so retries are disabled (`retry: 0`).
 * Network mode is `offlineFirst` to enqueue/respect online state.
 * On success, the learner profile query is invalidated in case the explain
 * updates recommendations cached in the profile.
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys";
import type { RecommendationExplanationResult } from "@/server/ai/types";

export type RecommendationExplainRequest = {
  learnerLevel: string;
  learnerGoal: string;
  activeStageTitle: string;
  recommendedAction: string;
  relatedSkill: string;
  recentSignal?: string;
};

export type RecommendationExplainResponse = RecommendationExplanationResult;

type RecommendationExplainApiSuccess = {
  ok: true;
  data: RecommendationExplainResponse;
};

type RecommendationExplainApiFailure = {
  ok: false;
  error: { code: string; message: string };
};

type RecommendationExplainApiResponse =
  | RecommendationExplainApiSuccess
  | RecommendationExplainApiFailure;

type RecommendationExplainMutationVariables = {
  payload: RecommendationExplainRequest;
  signal?: AbortSignal;
};

async function postRecommendationExplain(
  variables: RecommendationExplainMutationVariables,
): Promise<RecommendationExplainResponse> {
  const { payload, signal } = variables;

  const res = await fetch("/api/ai/recommendation-explain", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as RecommendationExplainApiResponse;

  if (!data.ok) {
    throw new Error(data.error?.message ?? "AI recommendation explain failed");
  }

  return data.data;
}

/**
 * Mutation hook for requesting explanation of an AI recommendation.
 *
 * @returns TanStack Query mutation result. Use `mutation.mutate({ payload, signal })`
 *          to trigger, `mutation.isPending` to render loading state, and
 *          `mutation.error` to render failure state.
 *
 * @remarks Currently unused in the UI — created for API consistency.
 */
export function useRecommendationExplainMutation(): UseMutationResult<
  RecommendationExplainResponse,
  Error,
  RecommendationExplainMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation<
    RecommendationExplainResponse,
    Error,
    RecommendationExplainMutationVariables
  >({
    mutationFn: postRecommendationExplain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.learners.profile() });
    },
    onError: (err) => {
      console.error("[recommendation-explain]", err);
    },
    retry: 0,
    networkMode: "offlineFirst",
  });
}
