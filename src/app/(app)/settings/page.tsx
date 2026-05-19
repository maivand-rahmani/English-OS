import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function SettingsPage() {
  return (
    <RoutePlaceholder
      sectionKey="settings"
      title="Preferences and profile surface"
      description="Settings is now part of the shared application shell, which means appearance controls and learner preferences can plug directly into the root theme attributes already on the document."
      focusPoints={[
        "Theme, text size, and density controls",
        "Profile and goals management",
        "Local-first preference persistence",
      ]}
      nextStepHref="/dashboard"
      nextStepLabel="Return to dashboard"
    />
  );
}
