import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  LayoutDashboard,
  Map,
  Sparkles,
} from "lucide-react";

export type AppSectionKey =
  | "dashboard"
  | "roadmap"
  | "resources"
  | "practice";

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
  { key: "practice", title: "Practice", href: "/practice", icon: Sparkles },
] as const;

export const appNavigation: readonly AppNavigationItem[] = appPrimaryNavigation;

export type AppSection = {
  key: AppSectionKey;
  title: string;
  href: string;
  icon: LucideIcon;
};

const appSections: Record<AppSectionKey, AppSection> = {
  dashboard: {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  roadmap: {
    key: "roadmap",
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  resources: {
    key: "resources",
    title: "Resources",
    href: "/resources",
    icon: BookOpenText,
  },
  practice: {
    key: "practice",
    title: "Practice",
    href: "/practice",
    icon: Sparkles,
  },
};

export function getAppSection(sectionKey: AppSectionKey) {
  return appSections[sectionKey];
}

export function getAppSectionByPathname(pathname: string) {
  const matched = appNavigation.find((item) => pathname.startsWith(item.href));

  return matched ? appSections[matched.key] : appSections.dashboard;
}
