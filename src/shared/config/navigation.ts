export const appNavigation = [
  { key: "dashboard", title: "Dashboard", href: "/dashboard" },
  { key: "roadmap", title: "Roadmap", href: "/roadmap" },
  { key: "resources", title: "Resources", href: "/resources" },
  { key: "writing", title: "Writing", href: "/writing" },
  { key: "speaking", title: "Speaking", href: "/speaking" },
  { key: "settings", title: "Settings", href: "/settings" },
] as const;

export type AppSectionKey = (typeof appNavigation)[number]["key"];

type LocalSectionItem = {
  label: string;
};

export type AppSection = {
  key: AppSectionKey;
  title: string;
  href: string;
  description: string;
  sidebarTitle: string;
  sidebarItems: readonly LocalSectionItem[];
};

const appSections: Record<AppSectionKey, AppSection> = {
  dashboard: {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    description: "The home base for daily clarity and the next best action.",
    sidebarTitle: "Dashboard lanes",
    sidebarItems: [
      { label: "Today" },
      { label: "This Week" },
      { label: "Review" },
      { label: "Weak Areas" },
      { label: "Recent Activity" },
    ],
  },
  roadmap: {
    key: "roadmap",
    title: "Roadmap",
    href: "/roadmap",
    description: "The long-range progression map across English skills.",
    sidebarTitle: "Roadmap lanes",
    sidebarItems: [
      { label: "Current Stage" },
      { label: "Upcoming" },
      { label: "Grammar" },
      { label: "Vocabulary" },
      { label: "Milestones" },
    ],
  },
  resources: {
    key: "resources",
    title: "Resources",
    href: "/resources",
    description: "Trusted resource discovery connected to skill goals.",
    sidebarTitle: "Resource lanes",
    sidebarItems: [
      { label: "Recommended" },
      { label: "Collections" },
      { label: "Grammar" },
      { label: "Listening" },
      { label: "Writing" },
    ],
  },
  writing: {
    key: "writing",
    title: "Writing",
    href: "/writing",
    description: "An active workspace for writing tasks, drafts, and feedback.",
    sidebarTitle: "Writing lanes",
    sidebarItems: [
      { label: "Tasks" },
      { label: "New Draft" },
      { label: "Feedback" },
      { label: "Mistakes" },
      { label: "History" },
    ],
  },
  speaking: {
    key: "speaking",
    title: "Speaking",
    href: "/speaking",
    description: "A dedicated place for prompts, recordings, and speaking review.",
    sidebarTitle: "Speaking lanes",
    sidebarItems: [
      { label: "Prompts" },
      { label: "Record" },
      { label: "Feedback" },
      { label: "Reflection" },
      { label: "History" },
    ],
  },
  settings: {
    key: "settings",
    title: "Settings",
    href: "/settings",
    description: "Profile, goals, preferences, and account controls.",
    sidebarTitle: "Settings lanes",
    sidebarItems: [
      { label: "Profile" },
      { label: "Goals" },
      { label: "Preferences" },
      { label: "Notifications" },
      { label: "Account" },
    ],
  },
};

export function getAppSection(sectionKey: AppSectionKey) {
  return appSections[sectionKey];
}

export function getAppSectionByPathname(pathname: string) {
  const matched = appNavigation.find((item) => pathname.startsWith(item.href));

  return matched ? appSections[matched.key] : appSections.dashboard;
}
