import { redirect } from "next/navigation";

import { getLearningProfile } from "@/server/learners/get-learning-profile";
import { getResourcesPageData } from "@/server/resources/get-resources-page-data";
import { ResourcesLibrary } from "@/widgets/resources-library";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const profile = await getLearningProfile();

  if (!profile || !profile.completedOnboardingAt) {
    redirect("/onboarding");
  }

  const resourcesPageData = await getResourcesPageData(profile);

  return <ResourcesLibrary content={resourcesPageData} />;
}
