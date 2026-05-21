import type {
  DashboardBlock,
  DashboardContentState,
  DashboardResource,
  DashboardSkill,
  DashboardSpeakingPrompt,
  DashboardWritingTask,
} from "@/entities/dashboard";

export type DashboardOverviewProps = {
  content: DashboardContentState;
};

export type ResourceWithContext = DashboardResource & {
  blockId: string;
  blockTitle: string;
  stageTitle: string;
  stageTypeLabel: string;
  blockSkills: DashboardSkill[];
};

export type WritingTaskWithContext = DashboardWritingTask & {
  blockId: string;
  stageTitle: string;
};

export type SpeakingPromptWithContext = DashboardSpeakingPrompt & {
  blockId: string;
  stageTitle: string;
};

export type ReviewPreviewItem = {
  id: string;
  label: string;
  context: string;
  urgency: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  when: string;
};

export type OutputFocus = {
  kind: "writing" | "speaking";
  title: string;
  detail: string;
  estimatedMinutes: number;
  status: string;
};

export type DashboardCollections = {
  allBlocks: DashboardBlock[];
  blockById: Map<string, DashboardBlock>;
  resourceById: Map<string, ResourceWithContext>;
  resources: ResourceWithContext[];
  speakingPrompts: SpeakingPromptWithContext[];
  writingTasks: WritingTaskWithContext[];
};
