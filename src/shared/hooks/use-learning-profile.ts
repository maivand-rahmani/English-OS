"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Snapshot of the learner's profile, hydrated from the server and cached
 * locally for instant first paint on subsequent visits.
 *
 * `null` fields mean "not yet collected" (guest / pre-onboarding).
 */
export type LearningProfileSnapshot = {
  id: string;
  userId: string | null;
  guestId: string | null;
  displayName: string | null;
  currentLevel: string | null;
  mainGoal: string | null;
  studyMinutesPerDay: number | null;
  strongestSkill: string | null;
  weakestSkill: string | null;
  preferredFormats: string[];
  mainPainPoint: string | null;
  completedOnboardingAt: string | null; // ISO string
  updatedAt: string; // ISO string
};

const CACHE_KEY = "english-os:learner-profile";

/**
 * The Server Action lives at `@/server/learners/get-learning-profile`.
 * A placeholder implementation ships with this hook so the import resolves
 * and the hook degrades gracefully (returns null) before T8 lands the real
 * database-backed version.
 */

/**
 * Hook that exposes the learner's profile with:
 *  - SSR-safe defaults (`isLoading: true`, `profile: null`)
 *  - localStorage cache hydration on mount
 *  - explicit `refresh()` to fetch from the server
 *  - `updateLocal()` to push optimistic updates after a save
 *
 * Works for both authenticated and guest learners — the server action is the
 * source of truth and may return `null` for visitors who haven't onboarded.
 */
export function useLearningProfile() {
  const [profile, setProfile] = useState<LearningProfileSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount. Synchronous, fast, no network.
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as LearningProfileSnapshot;
        setProfile(cached);
      }
    } catch (err) {
      console.error("Failed to read cached learning profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { getLearningProfile } = await import(
        "@/server/learners/get-learning-profile"
      );
      const fresh = await getLearningProfile();

      if (fresh) {
        setProfile(fresh);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
        }
      } else {
        setProfile(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(CACHE_KEY);
        }
      }
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load learning profile";
      setError(message);
      console.error("Failed to refresh learning profile:", err);
    }
  }, []);

  const updateLocal = useCallback((next: LearningProfileSnapshot) => {
    setProfile(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Failed to cache learning profile:", err);
      }
    }
  }, []);

  return { profile, isLoading, error, refresh, updateLocal } as const;
}
