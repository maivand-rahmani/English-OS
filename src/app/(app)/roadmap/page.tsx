import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function RoadmapPage() {
  return (
    <RoutePlaceholder
      sectionKey="roadmap"
      title="Structured progression map"
      description="Roadmap now inherits the shared shell, local sidebar, and responsive canvas. That gives stage, block, and milestone work a stable surface to land on in later phases."
      focusPoints={[
        "Stage and block visualization",
        "Roadmap state transitions",
        "Cross-links into recommended resources",
      ]}
      nextStepHref="/resources"
      nextStepLabel="Open the resources shell"
    />
  );
}
