import type { LearnerProfile } from "@prisma/client";
import Link from "next/link";

import type { DashboardBlock } from "@/entities/dashboard";

import { cn } from "@/shared/lib/utils";
import type { BlockState } from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";

import { formatMinutes, getSkillLine } from "../model/dashboard-overview-formatters";
import { DashboardCard, InfoTile } from "@/shared/ui/surfaces";
import { DashboardCelebrationCard } from "./dashboard-celebration-card";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatLevel(level: string | null): string {
  if (!level) return "Pre-A1";
  return level === "PRE_A1" ? "Pre-A1" : level;
}

type DashboardHeroSectionProps = {
  displayName: string;
  profile: LearnerProfile;
  focusBlock: DashboardBlock | null;
  focusBlockState: BlockState;
  totalPlanMinutes: number;
  busyAction: string | null;
  onCompleteBlock: (block: DashboardBlock) => void;
  onMarkBlockForReview: (block: DashboardBlock) => void;
  onStartBlock: (block: DashboardBlock, state: BlockState) => void;
};

export function DashboardHeroSection({
  displayName,
  profile,
  focusBlock,
  focusBlockState,
  totalPlanMinutes,
  busyAction,
  onCompleteBlock: _onCompleteBlock,
  onMarkBlockForReview: _onMarkBlockForReview,
  onStartBlock,
}: DashboardHeroSectionProps) {
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const levelLabel = formatLevel(profile.currentLevel);

  if (!focusBlock) {
    return (
      <DashboardCelebrationCard
        title="Roadmap complete!"
        message="You've completed every step in your roadmap."
        primaryAction={{ label: "View roadmap", href: "/roadmap" }}
      />
    );
  }

  return (
    <DashboardCard className="overflow-hidden bg-[linear-gradient(180deg,var(--surface-panel-strong),var(--surface-panel))] p-6 sm:p-7">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,var(--surface-module-pink),transparent_60%),radial-gradient(circle_at_top_right,var(--surface-module-blue),transparent_55%)]" />
      <div className="relative">
        <p className="text-sm font-medium text-muted-foreground">
          {greeting}, {displayName} · {levelLabel}
        </p>

        <div className="mt-2 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {focusBlock.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {focusBlock.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[20rem] xl:grid-cols-1">
            <InfoTile
              label="Focus"
              value={getSkillLine(focusBlock.skills)}
            />
            <InfoTile label="Time" value={formatMinutes(totalPlanMinutes)} />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => onStartBlock(focusBlock, focusBlockState)}
            disabled={busyAction === `block:${focusBlock.id}:start`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-center rounded-full px-5 sm:w-auto",
            )}
          >
            {focusBlockState === "in_progress" ? "Resume step" : "Start step"}
          </button>
        </div>

        <div className="mt-3">
          <Link
            href="/onboarding"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Update your learning profile
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
