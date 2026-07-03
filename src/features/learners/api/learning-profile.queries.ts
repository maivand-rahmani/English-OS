/**
 * TanStack Query hooks for the Learning Profile (learner-facing).
 *
 * **Server-action-to-query pattern**
 * Server actions are Next.js `"use server"` functions. We import them
 * **dynamically** inside `queryFn` so:
 *   1. Server-only code is never bundled into client chunks (Next.js would
 *      throw at build time on a static `import` of a server action into a
 *      `"use client"` module).
 *   2. The function reference is resolved at call time on the server (RSC)
 *      or as an RPC stub on the client (Next 13+).
 *   3. Tree-shaking is preserved — the server module is fetched lazily
 *      and may itself code-split its own deps.
 *
 * **Cache strategy**
 * `staleTime: 60_000` mirrors the global QueryClient default — a one-minute
 * fresh window prevents immediate refetch on remount.
 * `gcTime: 5 * 60_000` keeps unused profile data in the GC cache for fast
 * remount within the same session.
 * `networkMode: "offlineFirst"` lets the app keep showing the cached
 * profile when offline; the action will revalidate on reconnect.
 *
 * **Auth & guests**
 * The underlying `getLearningProfile()` reads the session / guest cookie
 * on the server — the hook itself is auth-agnostic.
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys";
import type { LearningProfileSnapshot } from "@/server/learners/get-learning-profile";

/**
 * Fetch the current learner's profile snapshot.
 *
 * Returns `null` when the user/guest has not completed onboarding yet
 * (no row in the DB) — consumers should treat `null` as "needs onboarding"
 * rather than an error.
 *
 * @example
 * ```tsx
 * const { data: profile, isLoading, error } = useLearningProfileQuery();
 * if (isLoading) return <Spinner />;
 * if (!profile) return <RedirectToOnboarding />;
 * ```
 */
export function useLearningProfileQuery(): UseQueryResult<LearningProfileSnapshot | null> {
  return useQuery({
    queryKey: queryKeys.learners.profile(),
    queryFn: async () => {
      const { getLearningProfile } = await import(
        "@/server/learners/get-learning-profile"
      );
      return getLearningProfile();
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    networkMode: "offlineFirst",
  });
}
