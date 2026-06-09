import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  LayoutDashboard,
  Map,
  Mic,
  PenSquare,
  Settings2,
} from "lucide-react";

export type AppSectionKey =
  | "dashboard"
  | "roadmap"
  | "resources"
  | "writing"
  | "speaking"
  | "settings";

export type AppNavigationItem = {
  key: AppSectionKey;
  title: string;
  href: string;
  icon: LucideIcon;
};

export const appPrimaryNavigation: readonly AppNavigationItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { key: "roadmap", title: "Roadmap", href: "/roadmap", icon: Map },
  {
    key: "resources",
    title: "Resources",
    href: "/resources",
    icon: BookOpenText,
  },
  { key: "writing", title: "Writing", href: "/writing", icon: PenSquare },
  { key: "speaking", title: "Speaking", href: "/speaking", icon: Mic },
] as const;

export const appHeaderActions: readonly AppNavigationItem[] = [
  { key: "settings", title: "Settings", href: "/settings", icon: Settings2 },
] as const;

export const appNavigation: readonly AppNavigationItem[] = [
  ...appPrimaryNavigation,
  ...appHeaderActions,
] as const;

export type AppSection = {
  key: AppSectionKey;
  title: string;
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  description: string;
};

const appSections: Record<AppSectionKey, AppSection> = {
  dashboard: {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    eyebrow: "Daily command center",
    description: "Your daily home for next steps, review, and momentum.",
  },
  roadmap: {
    key: "roadmap",
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
    eyebrow: "Long-range progression",
    description:
      "One immersive roadmap page for strategic direction and step-by-step progress.",
  },
  resources: {
    key: "resources",
    title: "Resources",
    href: "/resources",
    icon: BookOpenText,
    eyebrow: "Curated discovery",
    description:
      "A focused library experience with editorial curation, search, and filters inside one page.",
  },
  writing: {
    key: "writing",
    title: "Writing",
    href: "/writing",
    icon: PenSquare,
    eyebrow: "Focused practice",
    description:
      "One focused writing workspace for tasks, drafts, feedback, and local history.",
  },
  speaking: {
    key: "speaking",
    title: "Speaking",
    href: "/speaking",
    icon: Mic,
    eyebrow: "Active speaking work",
    description:
      "One focused speaking workspace for prompts, active sessions, reflection, and history.",
  },
  settings: {
    key: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings2,
    eyebrow: "Preferences and profile",
    description:
      "A simple settings page for profile, goals, appearance, and account controls.",
  },
};

export function getAppSection(sectionKey: AppSectionKey) {
  return appSections[sectionKey];
}

export function getAppSectionByPathname(pathname: string) {
  const matched = appNavigation.find((item) => pathname.startsWith(item.href));

  return matched ? appSections[matched.key] : appSections.dashboard;
}
