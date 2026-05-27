import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { WritingOverview } from "@/widgets/writing-overview";

export default async function WritingPage() {
  const dashboardState = await getDashboardState();

  return <WritingOverview content={dashboardState} />;
}
