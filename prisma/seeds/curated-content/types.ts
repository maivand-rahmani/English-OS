import type {
  CefrLevel,
  MapStrength,
  ResourceAccessType,
  ResourceDifficulty,
  ResourceFormat,
  ResourceType,
  ResourceUseCase,
  RoadmapBlockResourceRole,
  RoadmapBlockType,
  RoadmapStageType,
  RoadmapTemplateAudience,
  SpeakingPromptType,
  WritingTaskType,
} from "@prisma/client";

export type SkillSeed = {
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  subskills: Array<{
    slug: string;
    title: string;
    description: string;
    cefrMin?: CefrLevel;
    cefrMax?: CefrLevel;
    sortOrder: number;
  }>;
};

export type RoadmapTemplateSeed = {
  slug: string;
  title: string;
  description: string;
  audience: RoadmapTemplateAudience;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedWeeks: number;
  isDefault: boolean;
  stages: Array<{
    slug: string;
    title: string;
    summary: string;
    purpose: string;
    stageType: RoadmapStageType;
    sortOrder: number;
    cefrStart?: CefrLevel;
    cefrEnd?: CefrLevel;
    estimatedWeeks: number;
    blocks: Array<{
      slug: string;
      title: string;
      summary: string;
      purpose: string;
      whyNow: string;
      blockType: RoadmapBlockType;
      sortOrder: number;
      cefrStart?: CefrLevel;
      cefrEnd?: CefrLevel;
      estimatedMinutes: number;
      recommendedSessionCount: number;
    }>;
  }>;
};

export type BlockSkillMapSeed = {
  blockSlug: string;
  skillSlug: string;
  subskillSlug?: string;
  emphasis: MapStrength;
};

export type ResourceSeed = {
  slug: string;
  title: string;
  sourceName: string;
  url: string;
  description: string;
  resourceType: ResourceType;
  resourceFormat: ResourceFormat;
  primaryUseCase: ResourceUseCase;
  accessType: ResourceAccessType;
  difficulty: ResourceDifficulty;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  whyRecommended: string;
  bestUseCase: string;
  followUpHint?: string;
  targetAudience?: RoadmapTemplateAudience;
  isFeatured?: boolean;
  skillMaps: Array<{
    skillSlug: string;
    subskillSlug?: string;
    emphasis: MapStrength;
  }>;
};

export type BlockResourceLinkSeed = {
  blockSlug: string;
  resourceSlug: string;
  role: RoadmapBlockResourceRole;
  sortOrder: number;
  note?: string;
};

export type WritingTaskSeed = {
  slug: string;
  roadmapBlockSlug?: string;
  title: string;
  summary: string;
  instructions: string;
  taskType: WritingTaskType;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  wordCountMin?: number;
  wordCountMax?: number;
  successCriteria?: string;
};

export type SpeakingPromptSeed = {
  slug: string;
  roadmapBlockSlug?: string;
  title: string;
  summary: string;
  promptText: string;
  promptType: SpeakingPromptType;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  targetDurationSeconds?: number;
  prepHint?: string;
  followUpQuestion?: string;
};
