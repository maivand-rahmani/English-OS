import type { DashboardBlock } from "@/entities/dashboard";

import { cn } from "@/shared/lib/utils";
import type { BlockState } from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";

import { formatMinutes, getSkillLine } from "../model/dashboard-overview-formatters";
import { DashboardCard, InfoTile } from "@/shared/ui/surfaces";

type DashboardHeroSectionProps = {
  focusBlock: DashboardBlock | null;
  focusBlockState: BlockState;
  totalPlanMinutes: number;
  busyAction: string | null;
  onCompleteBlock: (block: DashboardBlock) => void;
  onMarkBlockForReview: (block: DashboardBlock) => void;
  onStartBlock: (block: DashboardBlock, state: BlockState) => void;
};

export function DashboardHeroSection({
  focusBlock,
  focusBlockState,
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
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {focusBlock?.title ?? "Your next block will appear here."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {focusBlock?.summary ?? "Choose a block to continue."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[20rem] xl:grid-cols-1">
            <InfoTile
              label="Focus"
              value={focusBlock ? getSkillLine(focusBlock.skills) : "No focus yet"}
            />
            <InfoTile label="Time" value={formatMinutes(totalPlanMinutes)} />
          </div>
        </div>

        {focusBlock ? (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => onStartBlock(focusBlock, focusBlockState)}
              disabled={busyAction === `block:${focusBlock.id}:start`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center rounded-full px-5 sm:w-auto",
              )}
            >
              {focusBlockState === "in_progress" ? "Resume block" : "Start block"}
            </button>

            <div className="mobile-stacked-actions">
              <button
                type="button"
                onClick={() => onCompleteBlock(focusBlock)}
                disabled={busyAction === `block:${focusBlock.id}:complete`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full border-white/70 bg-white/80",
                )}
              >
                Mark block complete
              </button>
              <button
                type="button"
                onClick={() => onMarkBlockForReview(focusBlock)}
                disabled={busyAction === `block:${focusBlock.id}:review`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-full border border-transparent text-foreground hover:bg-black/5",
                )}
              >
                Mark for review
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}
