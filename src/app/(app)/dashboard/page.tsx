import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { DashboardOverview } from "@/widgets/dashboard-overview";

export default async function DashboardPage() {
  const dashboardState = await getDashboardState();

  return <DashboardOverview content={dashboardState} />;
}
