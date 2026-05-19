import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function SpeakingPage() {
  return (
    <RoutePlaceholder
      sectionKey="speaking"
      title="Speaking practice workspace"
      description="Speaking has its own app surface from day one so recording flows, prompt history, and AI-assisted feedback can land without being squeezed into a general dashboard."
      focusPoints={[
        "Prompt and recording flows",
        "Feedback history and reflection",
        "Future transcript and speaking pattern data",
      ]}
      nextStepHref="/settings"
      nextStepLabel="Preview settings"
    />
  );
}
