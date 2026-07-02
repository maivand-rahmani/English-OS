import type { LearnerProfile } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { prisma } from "@/server/db/prisma";
import { PracticeOverview } from "@/widgets/practice-overview";

type PracticePageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

async function loadProfile(): Promise<LearnerProfile | null> {
  if (!prisma) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.learnerProfile.findUnique({
    where: { userId: session.user.id },
  });
}

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const [{ mode }, profile] = await Promise.all([searchParams, loadProfile()]);

  if (!profile || !profile.completedOnboardingAt) {
    redirect("/onboarding");
  }

  const dashboardState = await getDashboardState(profile);

  return (
    <PracticeOverview
      content={dashboardState}
      mode={mode === "speaking" ? "speaking" : "writing"}
    />
  );
}
