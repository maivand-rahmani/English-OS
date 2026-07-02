"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { OnboardingFormSchema } from "@/shared/constants/onboarding";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

import { setGuestIdCookie } from "./get-learning-profile";

export type CompleteOnboardingResult =
  | { success: true; profileId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Persist a learner's onboarding answers.
 *
 * Idempotent — uses `upsert` keyed by `userId` for authenticated users and by
 * `guestId` (cookie) for guests. A given user / guest always lands on the same
 * single row.
 */
export async function completeOnboarding(input: unknown): Promise<CompleteOnboardingResult> {
  if (!prisma) {
    return { success: false, error: "Database not configured" };
  }

  // 1. Validate input
  const parsed = OnboardingFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path) fieldErrors[path] = issue.message;
    }
    return {
      success: false,
      error: "Please check the form for errors",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const now = new Date();

  try {
    // 2. Check auth
    const session = await auth();

    if (session?.user?.id) {
      // Authenticated user
      const profile = await prisma.learnerProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          displayName: data.displayName ?? "Learner",
          currentLevel: data.currentLevel,
          mainGoal: data.mainGoal,
          studyMinutesPerDay: data.studyMinutesPerDay,
          strongestSkill: data.strongestSkill,
          weakestSkill: data.weakestSkill,
          preferredFormats: data.preferredFormats,
          mainPainPoint: data.mainPainPoint,
          completedOnboardingAt: now,
        },
        update: {
          displayName: data.displayName ?? "Learner",
          currentLevel: data.currentLevel,
          mainGoal: data.mainGoal,
          studyMinutesPerDay: data.studyMinutesPerDay,
          strongestSkill: data.strongestSkill,
          weakestSkill: data.weakestSkill,
          preferredFormats: data.preferredFormats,
          mainPainPoint: data.mainPainPoint,
          completedOnboardingAt: now,
        },
      });
      revalidatePath("/dashboard");
      revalidatePath("/onboarding");
      return { success: true, profileId: profile.id };
    }

    // Guest user
    const guestId = await setGuestIdCookie();
    // For guests we use the UncheckedCreateInput shape (no `user` relation).
    const createData: Prisma.LearnerProfileUncheckedCreateInput = {
      guestId,
      displayName: data.displayName ?? "Learner",
      currentLevel: data.currentLevel,
      mainGoal: data.mainGoal,
      studyMinutesPerDay: data.studyMinutesPerDay,
      strongestSkill: data.strongestSkill,
      weakestSkill: data.weakestSkill,
      preferredFormats: data.preferredFormats,
      mainPainPoint: data.mainPainPoint,
      completedOnboardingAt: now,
    };
    const profile = await prisma.learnerProfile.upsert({
      where: { guestId },
      create: createData,
      update: {
        displayName: data.displayName ?? "Learner",
        currentLevel: data.currentLevel,
        mainGoal: data.mainGoal,
        studyMinutesPerDay: data.studyMinutesPerDay,
        strongestSkill: data.strongestSkill,
        weakestSkill: data.weakestSkill,
        preferredFormats: data.preferredFormats,
        mainPainPoint: data.mainPainPoint,
        completedOnboardingAt: now,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true, profileId: profile.id };
  } catch (err) {
    console.error("completeOnboarding failed", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
