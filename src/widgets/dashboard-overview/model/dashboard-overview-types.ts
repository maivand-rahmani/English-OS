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
  urgencyCategory?: "overdue" | "due_soon" | "flagged" | "neglected";
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

// ── Phase 8 review & recommendation types (inline for self-containment) ──

export type ReviewQueueItem = {
  id: string;
  sourceType: "resource" | "block" | "writing_mistake" | "speaking_pattern";
  sourceId: string;
  label: string;
  context: string;
  urgency: "overdue" | "due_soon" | "flagged" | "neglected";
  priority: number;
  reason: string;
};

export type WeakAreaSignal = {
  skillSlug: string;
  skillTitle: string;
  signal: "weak" | "neglected" | "avoided" | "difficult";
  evidence: string;
  strength: number;
};

export type BestNextResource = {
  resource: ResourceWithContext | null;
  reason: string;
  urgency: "now" | "soon" | "optional";
};

export type DailyPlan = {
  focusBlock: DashboardBlock | null;
  reviewItems: ReviewPreviewItem[];
  outputTask: OutputFocus | null;
  totalPlanMinutes: number;
  planHeadline: string;
};
