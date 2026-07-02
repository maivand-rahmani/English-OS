"use server";

import type { LearnerProfile } from "@prisma/client";
import { cookies } from "next/headers";

import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

const GUEST_COOKIE = "english-os:guest-id";
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

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

function toSnapshot(profile: LearnerProfile): LearningProfileSnapshot {
  return {
    id: profile.id,
    userId: profile.userId,
    guestId: profile.guestId,
    displayName: profile.displayName,
    currentLevel: profile.currentLevel,
    mainGoal: profile.mainGoal,
    studyMinutesPerDay: profile.studyMinutesPerDay,
    strongestSkill: profile.strongestSkill,
    weakestSkill: profile.weakestSkill,
    preferredFormats: profile.preferredFormats,
    mainPainPoint: profile.mainPainPoint,
    completedOnboardingAt: profile.completedOnboardingAt
      ? profile.completedOnboardingAt.toISOString()
      : null,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

/**
 * Resolve the current learner's profile.
 *
 * - If the request has an authenticated session, look up by `userId`.
 * - Otherwise, look up by `guestId` cookie (set lazily by `setGuestIdCookie`).
 * - Returns `null` when no profile exists yet (e.g. user has not completed onboarding).
 *
 * Dates are serialized to ISO strings so the result is JSON-safe for the
 * client hook and `localStorage` cache.
 */
export async function getLearningProfile(): Promise<LearningProfileSnapshot | null> {
  if (!prisma) return null;

  const session = await auth();

  if (session?.user?.id) {
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
    });
    return profile ? toSnapshot(profile) : null;
  }

  // Guest: read guestId cookie, look up by guestId
  const cookieStore = await cookies();
  const guestId = cookieStore.get(GUEST_COOKIE)?.value;
  if (!guestId) return null;

  const profile = await prisma.learnerProfile.findUnique({
    where: { guestId },
  });
  return profile ? toSnapshot(profile) : null;
}

/**
 * Ensure a stable `guestId` cookie exists for the current request.
 * Idempotent — reuses the existing cookie if one is already set.
 * Returns the guestId (existing or newly generated).
 */
export async function setGuestIdCookie() {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_COOKIE)?.value;
  if (!guestId) {
    guestId = crypto.randomUUID();
    cookieStore.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: GUEST_COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return guestId;
}

