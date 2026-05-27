import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { RoadmapExplorer } from "@/widgets/roadmap-explorer";

export default async function RoadmapPage() {
  const dashboardState = await getDashboardState();

  return <RoadmapExplorer content={dashboardState} />;
}
