import { getResourcesPageData } from "@/server/resources/get-resources-page-data";
import { ResourcesLibrary } from "@/widgets/resources-library";

export default async function ResourcesPage() {
  const resourcesPageData = await getResourcesPageData();

  return <ResourcesLibrary content={resourcesPageData} />;
}
