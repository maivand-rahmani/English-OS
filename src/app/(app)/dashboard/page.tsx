import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      sectionKey="dashboard"
      title="Daily command center"
      description="Dashboard now sits inside the persistent English OS shell, ready for the first real control-center widgets. The next build phases can focus on what the learner should do next instead of rebuilding layout structure."
      focusPoints={[
        "Today plan and next action stack",
        "Review queue preview",
        "Progress snapshot and momentum signals",
        "Recent activity with contextual jump-offs",
      ]}
      nextStepHref="/roadmap"
      nextStepLabel="Open the roadmap shell"
    />
  );
}
