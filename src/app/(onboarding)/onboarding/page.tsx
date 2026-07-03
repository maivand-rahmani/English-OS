import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getOrCreateQueryClient } from "@/shared/api/getOrCreateQueryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { getLearningProfile } from "@/server/learners/get-learning-profile";
import { OnboardingWizard } from "@/widgets/onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const queryClient = getOrCreateQueryClient();
  const profile = await getLearningProfile();
  const isReRun = profile?.completedOnboardingAt != null;

  await queryClient.prefetchQuery({
    queryKey: queryKeys.learners.profile(),
    queryFn: async () => getLearningProfile(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
        <Suspense fallback={<div className="h-96" />}>
          <OnboardingWizard
            isReRun={isReRun}
            initialData={
              profile
                ? {
                    currentLevel: profile.currentLevel,
                    mainGoal: profile.mainGoal,
                    studyMinutesPerDay: profile.studyMinutesPerDay,
                    strongestSkill: profile.strongestSkill,
                    weakestSkill: profile.weakestSkill,
                    preferredFormats: profile.preferredFormats,
                    mainPainPoint: profile.mainPainPoint,
                  }
                : undefined
            }
          />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
