import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { PracticeOverview } from "@/widgets/practice-overview";

type PracticePageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const [{ mode }, dashboardState] = await Promise.all([
    searchParams,
    getDashboardState(),
  ]);

  return (
    <PracticeOverview
      content={dashboardState}
      mode={mode === "speaking" ? "speaking" : "writing"}
    />
  );
}
