"use server";

import { revalidatePath } from "next/cache";

import { OnboardingFormSchema } from "@/shared/constants/onboarding";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

export type UpdateLearningProfileResult =
  | { success: true; profileId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Partial update for an existing learner profile.
 *
 * Only the fields the user is allowed to change are accepted (any subset of the
 * onboarding schema). Immutable surface — `userId`, `guestId`, `createdAt` are
 * never overwritten from this action.
 */
export async function updateLearningProfile(input: unknown): Promise<UpdateLearningProfileResult> {
  if (!prisma) {
    return { success: false, error: "Database not configured" };
  }

  // Validate (use a partial of the full schema)
  const partial = OnboardingFormSchema.partial().safeParse(input);
  if (!partial.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of partial.error.issues) {
      const path = issue.path.join(".");
      if (path) fieldErrors[path] = issue.message;
    }
    return {
      success: false,
      error: "Please check the form for errors",
      fieldErrors,
    };
  }

  const data = partial.data;
  const session = await auth();

  try {
    let profile;
    if (session?.user?.id) {
      profile = await prisma.learnerProfile.update({
        where: { userId: session.user.id },
        data,
      });
    } else {
      // For guests, require the cookie + an existing profile
      const { getLearningProfile } = await import("./get-learning-profile");
      const existing = await getLearningProfile();
      if (!existing) {
        return { success: false, error: "No profile to update" };
      }
      profile = await prisma.learnerProfile.update({
        where: { id: existing.id },
        data,
      });
    }
    revalidatePath("/dashboard");
    return { success: true, profileId: profile.id };
  } catch (err) {
    console.error("updateLearningProfile failed", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
