import { RoutePlaceholder } from "@/widgets/route-placeholder";

export default function SettingsPage() {
  return (
    <RoutePlaceholder
      sectionKey="settings"
      title="Preferences and profile surface"
      description="Settings is already wired into the shell so future appearance controls, account settings, and learner preferences can land in a dedicated home."
      focusPoints={[
        "Theme, text size, and density controls",
        "Profile and goals management",
        "Local-first preference persistence",
      ]}
      nextStepHref="/dashboard"
      nextStepLabel="Return to the dashboard shell"
    />
  );
}
