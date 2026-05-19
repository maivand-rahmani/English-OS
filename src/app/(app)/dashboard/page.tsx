import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      sectionKey="dashboard"
      title="Dashboard is back to a neutral scaffold."
      description="The styled command-center version has been removed. This route is now just a simple placeholder until a new visual direction is defined."
      focusPoints={[
        "Today plan",
        "Review queue",
        "Progress snapshot",
        "Recent activity",
      ]}
      nextStepHref="/roadmap"
      nextStepLabel="Open roadmap placeholder"
    />
  );
}
