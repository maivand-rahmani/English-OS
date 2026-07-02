import type { LearnerProfile } from "@prisma/client";
import { redirect } from "next/navigation";

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
  const profile = await loadProfile();

  if (!profile || !profile.completedOnboardingAt) {
    redirect("/onboarding");
  }

  const dashboardState = await getDashboardState(profile);

  return <DashboardOverview content={dashboardState} profile={profile} />;
}
