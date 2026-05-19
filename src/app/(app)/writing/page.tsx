import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function WritingPage() {
  return (
    <RoutePlaceholder
      sectionKey="writing"
      title="Writing practice workspace"
      description="Writing is ready as a dedicated workspace route. Upcoming phases can focus on drafts, tasks, and feedback loops while keeping route files thin."
      focusPoints={[
        "Task and draft flows",
        "Local draft persistence",
        "Server-side AI feedback entry points",
      ]}
      nextStepHref="/speaking"
      nextStepLabel="Preview the speaking workspace"
    />
  );
}
