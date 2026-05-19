import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  ArrowUp,
  Bell,
  BookMarked,
  BookOpen,
  BookOpenText,
  CalendarDays,
  CalendarRange,
  FilePlus,
  FolderOpen,
  Headphones,
  History,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  PenSquare,
  RotateCcw,
  Settings2,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
} from "lucide-react";

type LocalSectionItem = {
  label: string;
  icon?: LucideIcon;
};

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

export const appNavigation: readonly AppNavigationItem[] = [
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
  { key: "settings", title: "Settings", href: "/settings", icon: Settings2 },
] as const;

export type AppSection = {
  key: AppSectionKey;
  title: string;
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  description: string;
  sidebarTitle: string;
  sidebarDescription: string;
  sidebarItems: readonly LocalSectionItem[];
};

const appSections: Record<AppSectionKey, AppSection> = {
  dashboard: {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    eyebrow: "Daily command center",
    description: "The home base for daily clarity and the next best action.",
    sidebarTitle: "Dashboard lanes",
    sidebarDescription: "Daily planning, review, and momentum signals.",
    sidebarItems: [
      { label: "Today", icon: CalendarDays },
      { label: "This Week", icon: CalendarRange },
      { label: "Review", icon: RotateCcw },
      { label: "Weak Areas", icon: TrendingDown },
      { label: "Recent Activity", icon: Activity },
    ],
  },
  roadmap: {
    key: "roadmap",
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
    eyebrow: "Long-range progression",
    description: "The long-range progression map across English skills.",
    sidebarTitle: "Roadmap lanes",
    sidebarDescription: "Structured stages, skills, and milestones.",
    sidebarItems: [
      { label: "Current Stage", icon: MapPin },
      { label: "Upcoming", icon: ArrowUp },
      { label: "Grammar", icon: BookOpenText },
      { label: "Vocabulary", icon: BookMarked },
      { label: "Reading", icon: BookOpen },
      { label: "Listening", icon: Headphones },
      { label: "Milestones", icon: Trophy },
    ],
  },
  resources: {
    key: "resources",
    title: "Resources",
    href: "/resources",
    icon: BookOpenText,
    eyebrow: "Curated discovery",
    description: "Trusted resource discovery connected to skill goals.",
    sidebarTitle: "Resource lanes",
    sidebarDescription: "Collections, levels, and skill-focused resource views.",
    sidebarItems: [
      { label: "Recommended", icon: Sparkles },
      { label: "Collections", icon: FolderOpen },
      { label: "Beginner", icon: Sprout },
      { label: "Intermediate", icon: TrendingUp },
      { label: "Grammar", icon: BookOpenText },
      { label: "Vocabulary", icon: BookMarked },
      { label: "Listening", icon: Headphones },
      { label: "Reading", icon: BookOpen },
      { label: "Speaking", icon: Mic },
      { label: "Writing", icon: PenSquare },
    ],
  },
  writing: {
    key: "writing",
    title: "Writing",
    href: "/writing",
    icon: PenSquare,
    eyebrow: "Focused practice",
    description: "An active workspace for writing tasks, drafts, and feedback.",
    sidebarTitle: "Writing lanes",
    sidebarDescription: "Drafting, submission, and mistake-review flows.",
    sidebarItems: [
      { label: "Tasks", icon: ListChecks },
      { label: "New Draft", icon: FilePlus },
      { label: "Feedback", icon: MessageSquare },
      { label: "Mistakes", icon: AlertCircle },
      { label: "History", icon: History },
    ],
  },
  speaking: {
    key: "speaking",
    title: "Speaking",
    href: "/speaking",
    icon: Mic,
    eyebrow: "Active speaking work",
    description: "A dedicated place for prompts, recordings, and speaking review.",
    sidebarTitle: "Speaking lanes",
    sidebarDescription: "Prompts, recordings, reflection, and feedback.",
    sidebarItems: [
      { label: "Prompts", icon: MessageCircle },
      { label: "Record", icon: Mic },
      { label: "Feedback", icon: MessageSquare },
      { label: "Reflection", icon: Lightbulb },
      { label: "History", icon: History },
    ],
  },
  settings: {
    key: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings2,
    eyebrow: "Preferences and profile",
    description: "Profile, goals, preferences, and account controls.",
    sidebarTitle: "Settings lanes",
    sidebarDescription: "Appearance, account, and learner configuration.",
    sidebarItems: [
      { label: "Profile", icon: UserRound },
      { label: "Goals", icon: Target },
      { label: "Preferences", icon: SlidersHorizontal },
      { label: "Notifications", icon: Bell },
      { label: "Account", icon: Shield },
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
