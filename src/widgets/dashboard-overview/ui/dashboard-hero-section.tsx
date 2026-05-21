import { Mic, PenSquare, RotateCcw, Sparkles, Target } from "lucide-react";

import type { DashboardBlock, DashboardContentState } from "@/entities/dashboard";
import { cn } from "@/shared/lib/utils";
import type { BlockState } from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";

import type { OutputFocus, ReviewPreviewItem } from "../model/dashboard-overview-types";
import {
  formatMinutes,
  getSkillLine,
  humanizeState,
} from "../model/dashboard-overview-formatters";
import {
  DashboardCard,
  InfoTile,
  PlanRow,
  SectionEyebrow,
  SummaryBadge,
} from "./dashboard-surfaces";

type DashboardHeroSectionProps = {
  content: DashboardContentState;
  focusBlock: DashboardBlock | null;
  focusBlockState: BlockState;
  outputFocus: OutputFocus | null;
  planHeadline: string;
  reviewHeadline: string;
  reviewPreviewItems: ReviewPreviewItem[];
  totalPlanMinutes: number;
  busyAction: string | null;
  onCompleteBlock: (block: DashboardBlock) => void;
  onMarkBlockForReview: (block: DashboardBlock) => void;
  onStartBlock: (block: DashboardBlock, state: BlockState) => void;
};

export function DashboardHeroSection({
  content,
  focusBlock,
  focusBlockState,
  outputFocus,
  planHeadline,
  reviewHeadline,
  reviewPreviewItems,
  totalPlanMinutes,
  busyAction,
  onCompleteBlock,
  onMarkBlockForReview,
  onStartBlock,
}: DashboardHeroSectionProps) {
  return (
    <DashboardCard className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,243,255,0.94))] p-6 sm:p-7">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,211,226,0.42),transparent_60%),radial-gradient(circle_at_top_right,rgba(189,205,255,0.34),transparent_55%)]" />
      <div className="relative">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow icon={Sparkles}>Today plan</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {focusBlock?.title ?? "Your next block will appear here."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {planHeadline}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[20rem] xl:grid-cols-1">
            <InfoTile
              label="Current stage"
              value={focusBlock?.stageTitle ?? content.templateTitle}
            />
            <InfoTile label="Estimated time" value={formatMinutes(totalPlanMinutes)} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          <SummaryBadge
            label="Level"
            value={content.learnerLevelLabel}
            accent="neutral"
          />
          <SummaryBadge label="Goal" value={content.goalLabel} accent="rose" />
          <SummaryBadge
            label="Current focus"
            value={focusBlock ? getSkillLine(focusBlock.skills) : "No focus yet"}
            accent="blue"
          />
          <SummaryBadge
            label="Roadmap state"
            value={humanizeState(focusBlockState)}
            accent="neutral"
          />
        </div>

        <div className="mt-8 grid gap-3">
          <PlanRow
            icon={Target}
            title="Main roadmap action"
            headline={focusBlock?.summary ?? "Pick up the next roadmap block."}
            meta={`${focusBlock?.stageTypeLabel ?? "roadmap"} / ${formatMinutes(
              focusBlock?.estimatedMinutes,
            )}`}
            state={humanizeState(focusBlockState)}
          />
          <PlanRow
            icon={RotateCcw}
            title="Review focus"
            headline={reviewPreviewItems[0]?.label ?? "No urgent review has surfaced yet."}
            meta={
              reviewPreviewItems[0]?.context ??
              "Finish a block or flag friction to start shaping review."
            }
            state={reviewHeadline}
          />
          <PlanRow
            icon={outputFocus?.kind === "speaking" ? Mic : PenSquare}
            title="Output action"
            headline={outputFocus?.title ?? "Writing and speaking prompts will appear here."}
            meta={
              outputFocus?.detail ??
              "Use one short output action to turn study into active English."
            }
            state={outputFocus?.status ?? "queued"}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {focusBlock ? (
            <button
              type="button"
              onClick={() => onStartBlock(focusBlock, focusBlockState)}
              disabled={busyAction === `block:${focusBlock.id}:start`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "justify-center rounded-full px-5",
              )}
            >
              {focusBlockState === "in_progress" ? "Resume block" : "Start block"}
            </button>
          ) : null}

          {focusBlock ? (
            <button
              type="button"
              onClick={() => onCompleteBlock(focusBlock)}
              disabled={busyAction === `block:${focusBlock.id}:complete`}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "justify-center rounded-full border-white/70 bg-white/80 px-5",
              )}
            >
              Mark block complete
            </button>
          ) : null}

          {focusBlock ? (
            <button
              type="button"
              onClick={() => onMarkBlockForReview(focusBlock)}
              disabled={busyAction === `block:${focusBlock.id}:review`}
              className={cn(
                buttonVariants({ size: "lg", variant: "ghost" }),
                "justify-center rounded-full border border-transparent px-5 text-foreground hover:bg-black/5",
              )}
            >
              Mark for review
            </button>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
}
