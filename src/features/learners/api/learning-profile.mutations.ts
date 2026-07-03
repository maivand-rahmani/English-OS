/**
 * TanStack Query mutation hooks for the Learning Profile (learner-facing).
 *
 * **Server-action-to-query pattern**
 * Server actions are Next.js `"use server"` functions. We import them
 * **dynamically** inside `mutationFn` so:
 *   1. Server-only code is never bundled into client chunks (Next.js would
 *      throw at build time on a static `import` of a server action into a
 *      `"use client"` module).
 *   2. The function reference is resolved at call time on the server (RSC)
 *      or as an RPC stub on the client (Next 13+).
 *   3. Tree-shaking is preserved — the server module is fetched lazily
 *      and may itself code-split its own deps.
 *
 * **Cache invalidation**
 * Both mutations invalidate `queryKeys.learners.profile()` on success so
 * the next `useLearningProfileQuery()` read pulls the fresh row from the
 * server. This is the ONLY cache layer — there is no localStorage mirror.
 *
 * **Error & success handling**
 * - The server actions return a discriminated union (`success: true | false`)
 *   rather than throwing. We check `result.success` before invalidating;
 *   a failed server-side validation should NOT bust the cache.
 * - Unexpected runtime errors are caught by the mutation lifecycle and
 *   logged via `console.error` (toast UX is wired separately in T6).
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys";
import type { OnboardingFormData } from "@/shared/constants/onboarding";
import type { CompleteOnboardingResult } from "@/server/learners/complete-onboarding";
import type { UpdateLearningProfileResult } from "@/server/learners/update-learning-profile";

// Re-export the server-action result types so consumers can import them
// from a single location alongside the hooks.
export type { CompleteOnboardingResult, UpdateLearningProfileResult };

/**
 * Partial update of the current learner's profile.
 *
 * Accepts any subset of the onboarding form fields. The server action
 * validates with `OnboardingFormSchema.partial()`, so an invalid subset
 * returns `{ success: false, fieldErrors }` rather than throwing.
 *
 * On success, invalidates the profile query so the next read reflects
 * the new state.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLearningProfileMutation();
 * mutate({ currentLevel: "B1" });
 * ```
 */
export function useUpdateLearningProfileMutation(): UseMutationResult<
  UpdateLearningProfileResult,
  Error,
  OnboardingFormData
> {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateLearningProfileResult,
    Error,
    OnboardingFormData
  >({
    mutationFn: async (input) => {
      const { updateLearningProfile } = await import(
        "@/server/learners/update-learning-profile"
      );
      return updateLearningProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.learners.profile() });
    },
    onError: (error) => {
      console.error("useUpdateLearningProfileMutation failed", error);
    },
  });
}

/**
 * Persist a learner's onboarding answers (first-run flow).
 *
 * Idempotent on the server — uses upsert keyed by `userId` / `guestId`.
 * On success, invalidates the profile query so the post-onboarding read
 * picks up the `completedOnboardingAt` timestamp.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCompleteOnboardingMutation();
 * mutate(formData, {
 *   onSuccess: (result) => {
 *     if (result.success) router.push("/dashboard");
 *   },
 * });
 * ```
 */
export function useCompleteOnboardingMutation(): UseMutationResult<
  CompleteOnboardingResult,
  Error,
  OnboardingFormData
> {
  const queryClient = useQueryClient();

  return useMutation<
    CompleteOnboardingResult,
    Error,
    OnboardingFormData
  >({
    mutationFn: async (input) => {
      const { completeOnboarding } = await import(
        "@/server/learners/complete-onboarding"
      );
      return completeOnboarding(input);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.learners.profile() });
      }
    },
    onError: (error) => {
      console.error("useCompleteOnboardingMutation failed", error);
    },
  });
}
