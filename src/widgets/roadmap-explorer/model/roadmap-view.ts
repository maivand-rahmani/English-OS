import type { DashboardBlock, DashboardStage } from "@/entities/dashboard";
import type { BlockState, ProgressEntry } from "@/shared/types";

export type RoadmapStep = {
  block: DashboardBlock;
  index: number;
  stage: DashboardStage;
  stageIndex: number;
};

export type RoadmapVisualState = BlockState | "current" | "locked_later";

export const roadmapStepPoints = [
  { x: 12, y: 54 },
  { x: 34, y: 30 },
  { x: 56, y: 54 },
  { x: 78, y: 30 },
  { x: 90, y: 54 },
];

const stepsPerMapRow = 5;
const mapRowGap = 28;
const mapTopInset = 28;
const mapBottomInset = 26;

export function buildRoadmapSteps(stages: DashboardStage[]) {
  return stages.flatMap((stage, stageIndex) =>
    stage.blocks.map((block) => ({
      block,
      index: 0,
      stage,
      stageIndex,
    })),
  ).map((step, index) => ({ ...step, index }));
}

export function getEntryState(entry: ProgressEntry | undefined): BlockState {
  return entry?.state ?? "not_started";
}

export function getCurrentStepIndex(steps: RoadmapStep[], progressById: Map<string, ProgressEntry>) {
  const currentIndex = steps.findIndex((step) => {
    const state = getEntryState(progressById.get(step.block.id));
    return state !== "completed" && state !== "skipped_for_now";
  });

  return currentIndex === -1 ? Math.max(steps.length - 1, 0) : currentIndex;
}

export function getStepVisualState(
  step: RoadmapStep,
  progressById: Map<string, ProgressEntry>,
  currentStepIndex: number,
): RoadmapVisualState {
  const state = getEntryState(progressById.get(step.block.id));

  if (state === "not_started" && step.index === currentStepIndex) {
    return "current";
  }

  if (state === "not_started" && step.index > currentStepIndex) {
    return "locked_later";
  }

  return state;
}

export function getProgressValue(state: RoadmapVisualState) {
  switch (state) {
    case "completed":
      return 100;
    case "in_progress":
      return 55;
    case "current":
      return 32;
    case "difficult":
      return 58;
    case "needs_review":
      return 70;
    case "skipped_for_now":
      return 12;
    default:
      return 0;
  }
}

export function humanizeState(state: RoadmapVisualState) {
  switch (state) {
    case "current":
      return "Current";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "difficult":
      return "Difficult";
    case "needs_review":
      return "Needs review";
    case "skipped_for_now":
      return "Skipped";
    case "locked_later":
      return "Locked / Later";
    default:
      return "Not started";
  }
}

export function formatMinutes(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) {
    return "Flexible";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0 ? `${hours} hr` : `${hours} hr ${remainingMinutes} min`;
}

export function getPrimarySkill(block: DashboardBlock) {
  return block.skills.find((skill) => skill.emphasis === "primary") ?? block.skills[0] ?? null;
}

export function getNextAction(state: RoadmapVisualState) {
  switch (state) {
    case "in_progress":
      return "Continue step";
    case "completed":
      return "Review step";
    case "difficult":
      return "Practice again";
    case "needs_review":
      return "Review now";
    case "skipped_for_now":
      return "Return to step";
    case "locked_later":
      return "Preview later step";
    default:
      return "Start step";
  }
}

export function getStepPoint(index: number, total: number) {
  if (total <= roadmapStepPoints.length) {
    return roadmapStepPoints[index] ?? roadmapStepPoints.at(-1)!;
  }

  const row = Math.floor(index / stepsPerMapRow);
  const positionInRow = index % stepsPerMapRow;
  const isReverseRow = row % 2 === 1;
  const orderedPosition = isReverseRow
    ? stepsPerMapRow - 1 - positionInRow
    : positionInRow;
  const x = 12 + orderedPosition * 19;
  const y = mapTopInset + row * mapRowGap;

  return { x, y };
}

export function getRoadmapMapHeight(total: number) {
  if (total <= roadmapStepPoints.length) {
    return 76;
  }

  const rows = Math.ceil(total / stepsPerMapRow);

  return mapTopInset + Math.max(rows - 1, 0) * mapRowGap + mapBottomInset;
}

export function getRoadmapNodeTopPercent(index: number, total: number) {
  const point = getStepPoint(index, total);

  return (point.y / getRoadmapMapHeight(total)) * 100;
}

export function toBlockTarget(block: DashboardBlock) {
  return {
    id: block.id,
    title: block.title,
    stageId: block.stageId,
    stageTitle: block.stageTitle,
  };
}
