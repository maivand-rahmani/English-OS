import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function WritingPage() {
  return (
    <RoutePlaceholder
      sectionKey="writing"
      title="Writing practice workspace"
      description="Writing now has a dedicated shell surface with stable navigation around it. Draft flows, tasks, and feedback UI can arrive without reshaping the global app frame."
      focusPoints={[
        "Task and draft flows",
        "Local draft persistence",
        "Server-side AI feedback entry points",
      ]}
      nextStepHref="/speaking"
      nextStepLabel="Open the speaking shell"
    />
  );
}
