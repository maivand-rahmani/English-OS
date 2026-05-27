import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { SpeakingOverview } from "@/widgets/speaking-overview";

export default async function SpeakingPage() {
  const dashboardState = await getDashboardState();

  return <SpeakingOverview content={dashboardState} />;
}
