import type { LearnerProfile } from "@prisma/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getOrCreateQueryClient } from "@/shared/api/getOrCreateQueryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { auth } from "@/server/auth";
import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { prisma } from "@/server/db/prisma";
import { DashboardOverview } from "@/widgets/dashboard-overview";

export const dynamic = "force-dynamic";

async function loadProfile(): Promise<LearnerProfile | null> {
  if (!prisma) return null;

  const session = await auth();
  if (session?.user?.id) {
    return prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
    });
  }

  // No authenticated session yet — fall through and let onboarding handle it.
  return null;
}

export default async function DashboardPage() {
  const queryClient = getOrCreateQueryClient();
  const profile = await loadProfile();

  if (!profile || !profile.completedOnboardingAt) {
    redirect("/onboarding");
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.learners.profile(),
    queryFn: async () => {
      const { getLearningProfile } = await import(
        "@/server/learners/get-learning-profile"
      );
      return getLearningProfile();
    },
  });

  const dashboardState = await getDashboardState(profile);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardOverview content={dashboardState} profile={profile} />
    </HydrationBoundary>
  );
}
