import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function RoadmapPage() {
  return (
    <RoutePlaceholder
      sectionKey="roadmap"
      title="Structured progression map"
      description="Roadmap now exists as a first-class app route, ready for stage, block, and milestone work. Later phases can focus on progression logic instead of route plumbing."
      focusPoints={[
        "Stage and block visualization",
        "Roadmap state transitions",
        "Cross-links into recommended resources",
      ]}
      nextStepHref="/resources"
      nextStepLabel="Preview the resources route"
    />
  );
}
