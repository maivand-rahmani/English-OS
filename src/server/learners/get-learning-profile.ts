"use server";

/**
 * Stub for the get-learning-profile Server Action.
 *
 * T8 will replace the body of this file with the real implementation that
 * resolves the current learner's profile (authenticated or guest) from the
 * database. Until then this stub returns `null` so the hook's `refresh()`
 * degrades gracefully to "no profile yet" and clears the local cache.
 */
export async function getLearningProfile() {
  return null;
}
