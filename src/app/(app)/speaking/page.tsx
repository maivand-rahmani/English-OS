import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function SpeakingPage() {
  return (
    <RoutePlaceholder
      sectionKey="speaking"
      title="Speaking practice workspace"
      description="Speaking now lives in the same composed shell as the rest of the product, with enough room for a primary practice area and later contextual feedback panels."
      focusPoints={[
        "Prompt and recording flows",
        "Feedback history and reflection",
        "Future transcript and speaking pattern data",
      ]}
      nextStepHref="/settings"
      nextStepLabel="Open settings"
    />
  );
}
