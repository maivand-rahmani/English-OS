export type DashboardSkill = {
  slug: string;
  title: string;
  emphasis: "primary" | "supporting";
};

export type DashboardResource = {
  id: string;
  slug: string;
  title: string;
  sourceName: string;
  resourceTypeLabel: string;
  resourceFormatLabel: string;
  primaryUseCaseLabel: string;
  estimatedMinutes: number | null;
  whyRecommended: string;
  bestUseCase: string;
  followUpHint: string | null;
  note: string | null;
  role: "core" | "supporting" | "stretch";
  skills: DashboardSkill[];
  isFeatured: boolean;
  url: string;
  description: string | null;
  accessTypeLabel: string;
  difficultyLabel: string;
  cefrLabel: string | null;
};

export type DashboardWritingTask = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  estimatedMinutes: number | null;
  wordCountMin: number | null;
  wordCountMax: number | null;
  blockTitle: string;
  instructions: string;
  successCriteria: string | null;
};

export type DashboardSpeakingPrompt = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  promptText: string;
  estimatedMinutes: number | null;
  targetDurationSeconds: number | null;
  blockTitle: string;
  prepHint: string | null;
  followUpQuestion: string | null;
};

export type DashboardBlock = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  purpose: string | null;
  whyNow: string | null;
  estimatedMinutes: number | null;
  recommendedSessionCount: number | null;
  cefrLabel: string | null;
  stageId: string;
  stageTitle: string;
  stageSummary: string | null;
  stageTypeLabel: string;
  blockTypeLabel: string;
  skills: DashboardSkill[];
  resources: DashboardResource[];
  writingTasks: DashboardWritingTask[];
  speakingPrompts: DashboardSpeakingPrompt[];
};

export type DashboardStage = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  purpose: string | null;
  stageTypeLabel: string;
  estimatedWeeks: number | null;
  cefrLabel: string | null;
  blocks: DashboardBlock[];
};

export type DashboardContentState = {
  learnerLevelLabel: string;
  goalLabel: string;
  templateTitle: string;
  templateDescription: string | null;
  audienceLabel: string;
  estimatedWeeks: number | null;
  stageCount: number;
  blockCount: number;
  resourceCount: number;
  stages: DashboardStage[];
};
