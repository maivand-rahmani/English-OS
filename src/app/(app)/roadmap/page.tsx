import type { LearnerProfile } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { prisma } from "@/server/db/prisma";
import { RoadmapExplorer } from "@/widgets/roadmap-explorer";

async function loadProfile(): Promise<LearnerProfile | null> {
  if (!prisma) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.learnerProfile.findUnique({
    where: { userId: session.user.id },
  });
}

export default async function RoadmapPage() {
  const profile = await loadProfile();

  if (!profile || !profile.completedOnboardingAt) {
    redirect("/onboarding");
  }

  const dashboardState = await getDashboardState(profile);

  return <RoadmapExplorer content={dashboardState} />;
}
