import { getDashboardState } from "@/server/dashboard/get-dashboard-state";
import { ResourcesLibrary } from "@/widgets/resources-library";

export default async function ResourcesPage() {
  const dashboardState = await getDashboardState();

  return <ResourcesLibrary content={dashboardState} />;
}
