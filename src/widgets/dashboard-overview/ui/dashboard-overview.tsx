"use client";

import { AlertTriangle, BarChart3 } from "lucide-react";

import { useMediaQuery } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { ErrorState, SpinnerPage } from "@/shared/ui";

import type {
  DashboardOverviewProps,
  WeakAreaSignal,
} from "../model/dashboard-overview-types";
import { useDashboardOverview } from "../model/use-dashboard-overview";

import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardHeroSection } from "./dashboard-hero-section";
import { DashboardProgressActivitySection } from "./dashboard-progress-activity-section";
import { DashboardResourceSection } from "./dashboard-resource-section";
import { DashboardReviewSection } from "./dashboard-review-section";

function signalColor(signal: WeakAreaSignal["signal"]): string {
  switch (signal) {
    case "weak":
      return "text-amber-600 dark:text-amber-400";
    case "neglected":
      return "text-gray-500 dark:text-gray-400";
    case "avoided":
      return "text-orange-600 dark:text-orange-400";
    case "difficult":
      return "text-red-600 dark:text-red-400";
  }
}

function signalLabel(signal: WeakAreaSignal["signal"]): string {
  switch (signal) {
    case "weak":
      return "weak";
    case "neglected":
      return "neglected";
    case "avoided":
      return "avoided";
    case "difficult":
      return "difficult";
  }
}

function WeakAreasCard({
  weakAreas,
  neglectedAreas,
}: {
  weakAreas: WeakAreaSignal[];
  neglectedAreas: WeakAreaSignal[];
}) {
  const combined: WeakAreaSignal[] = [];

  for (const area of weakAreas) {
    if (!combined.find((c) => c.skillSlug === area.skillSlug)) {
      combined.push(area);
    }
  }

  for (const area of neglectedAreas) {
    if (!combined.find((c) => c.skillSlug === area.skillSlug)) {
      combined.push(area);
    }
  }

  const top = combined.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="rounded-[1.55rem] border border-surface-stroke-strong bg-surface-panel-muted/40 px-4 py-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Skill signals
        </p>
      </div>
      <div className="mt-3 grid gap-2">
        {top.map((area) => (
          <div
            key={area.skillSlug}
            className="flex items-start gap-2 text-sm"
          >
            <AlertTriangle className={cn("mt-0.5 size-3 shrink-0", signalColor(area.signal))} />
            <div className="min-w-0">
              <span className="font-medium text-foreground">{area.skillTitle}</span>{" "}
              <span className={cn("text-xs font-medium", signalColor(area.signal))}>
                {signalLabel(area.signal)}
              </span>
              <p className="text-xs text-muted-foreground">{area.evidence}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOverview({ content }: DashboardOverviewProps) {
  const overview = useDashboardOverview(content);
  const isDesktopDashboard = useMediaQuery("(min-width: 1280px)");

  if (overview.localStateLoading) {
    return <SpinnerPage message="Loading your dashboard..." />;
  }

  if (overview.error) {
    return (
      <ErrorState
        icon={AlertTriangle}
        title="Could not load dashboard data"
        message={overview.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (overview.allBlocks.length === 0) {
    return <DashboardEmptyState />;
  }

  const resourceSection = (
    <DashboardResourceSection
      busyAction={overview.busyAction}
      focusBlockState={overview.focusBlockState}
      focusResource={overview.focusResource}
      focusResourceEntry={overview.focusResourceEntry}
      recommendationReason={overview.recommendationReason}
      onCompleteResource={(resource) =>
        overview.handleResourceStateChange(resource, "completed", "complete")
      }
      onMarkResourceDifficult={(resource) =>
        overview.handleResourceStateChange(resource, "needs_review", "difficult")
      }
      onStartResource={(resource) =>
        overview.handleResourceStateChange(resource, "in_progress", "start")
      }
    />
  );

  const reviewSection = (
    <DashboardReviewSection
      reviewHeadline={overview.reviewHeadline}
      reviewPreviewItems={overview.reviewPreviewItems}
    />
  );

  const weakAreasSection = (
    <WeakAreasCard
      weakAreas={overview.weakAreas}
      neglectedAreas={overview.neglectedAreas}
    />
  );

  const progressActivitySection = (
    <DashboardProgressActivitySection
      activeDaysThisWeek={overview.activeDaysThisWeek}
      consistencyLabel={overview.consistencyLabel}
      roadmapCompletion={overview.roadmapCompletion}
      strongestSkill={overview.strongestSkill}
      weakestSkill={overview.weakestSkill}
      recentActivity={overview.recentActivity}
      nextWritingTask={overview.nextWritingTask}
      nextSpeakingPrompt={overview.nextSpeakingPrompt}
    />
  );

  if (isDesktopDashboard) {
    return (
      <section className="space-y-[var(--layout-gap)]">
        <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="animate-stagger-fade-in stagger-1">
            <DashboardHeroSection
              displayName={content.displayName}
              busyAction={overview.busyAction}
              focusBlock={overview.focusBlock}
              focusBlockState={overview.focusBlockState}
              totalPlanMinutes={overview.totalPlanMinutes}
              onCompleteBlock={(block) =>
                overview.handleBlockStateChange(block, "completed", "complete")
              }
              onMarkBlockForReview={(block) =>
                overview.handleBlockStateChange(block, "needs_review", "review")
              }
              onStartBlock={(block, state) =>
                overview.handleBlockStateChange(
                  block,
                  state === "completed" ? "completed" : "in_progress",
                  "start",
                )
              }
            />
          </div>

          <div className="space-y-[var(--layout-gap)]">
            <div className="animate-stagger-fade-in stagger-2">{resourceSection}</div>
            <div className="animate-stagger-fade-in stagger-3">{reviewSection}</div>
            {overview.weakAreas.length > 0 || overview.neglectedAreas.length > 0 ? (
              <div className="animate-stagger-fade-in stagger-4">{weakAreasSection}</div>
            ) : null}
          </div>
        </div>

        <div className="animate-stagger-fade-in stagger-5">
          {progressActivitySection}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-[var(--layout-gap)]">
      <div className="animate-stagger-fade-in stagger-1">
        <DashboardHeroSection
          displayName={content.displayName}
          busyAction={overview.busyAction}
          focusBlock={overview.focusBlock}
          focusBlockState={overview.focusBlockState}
          totalPlanMinutes={overview.totalPlanMinutes}
          onCompleteBlock={(block) =>
            overview.handleBlockStateChange(block, "completed", "complete")
          }
          onMarkBlockForReview={(block) =>
            overview.handleBlockStateChange(block, "needs_review", "review")
          }
          onStartBlock={(block, state) =>
            overview.handleBlockStateChange(
              block,
              state === "completed" ? "completed" : "in_progress",
              "start",
            )
          }
        />
      </div>
      <div className="animate-stagger-fade-in stagger-2">{progressActivitySection}</div>
      <div className="animate-stagger-fade-in stagger-3">{resourceSection}</div>
      <div className="animate-stagger-fade-in stagger-4">{reviewSection}</div>
      {overview.weakAreas.length > 0 || overview.neglectedAreas.length > 0 ? (
        <div className="animate-stagger-fade-in stagger-5">{weakAreasSection}</div>
      ) : null}
    </section>
  );
}
