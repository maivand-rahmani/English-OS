import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function ResourcesPage() {
  return (
    <RoutePlaceholder
      sectionKey="resources"
      title="Curated discovery layer"
      description="Resources is now mounted inside the product shell with room for filters, collection views, and recommendation context. The route can stay thin while the real library widgets arrive later."
      focusPoints={[
        "Recommended resource lists",
        "Collection and topic filters",
        "Context-aware links from roadmap and dashboard",
      ]}
      nextStepHref="/writing"
      nextStepLabel="Open the writing shell"
    />
  );
}
