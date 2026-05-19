import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function ResourcesPage() {
  return (
    <RoutePlaceholder
      sectionKey="resources"
      title="Curated discovery layer"
      description="Resources has its route group, sidebar structure, and shell placement in place. The next build steps will connect structured metadata, recommendation context, and collection views."
      focusPoints={[
        "Recommended resource lists",
        "Collection and topic filters",
        "Context-aware links from roadmap and dashboard",
      ]}
      nextStepHref="/writing"
      nextStepLabel="Preview the writing workspace"
    />
  );
}
