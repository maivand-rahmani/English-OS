import type { DashboardSkill } from "@/entities/dashboard";

export type ResourcesPageRoadmapLink = {
  blockId: string;
  blockSlug: string;
  blockTitle: string;
  note: string | null;
  role: "core" | "supporting" | "stretch";
  stageId: string;
  stageTitle: string;
};

export type ResourcesPageResource = {
  accessTypeLabel: string;
  cefrLabel: string | null;
  description: string | null;
  difficultyLabel: string;
  estimatedMinutes: number | null;
  followUpHint: string | null;
  bestUseCase: string;
  id: string;
  isFeatured: boolean;
  primaryUseCaseLabel: string;
  resourceFormatLabel: string;
  resourceTypeLabel: string;
  roadmapLinks: ResourcesPageRoadmapLink[];
  skills: DashboardSkill[];
  slug: string;
  sourceName: string;
  title: string;
  url: string;
  whyRecommended: string;
};

export type ResourcesPageData = {
  audienceLabel: string;
  estimatedWeeks: number | null;
  goalLabel: string;
  learnerLevelLabel: string;
  resourceCount: number;
  resources: ResourcesPageResource[];
  templateDescription: string | null;
  templateTitle: string;
};
