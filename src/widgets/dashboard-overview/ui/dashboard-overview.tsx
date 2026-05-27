"use client";

import { useMediaQuery } from "@/shared/hooks";

import type { DashboardOverviewProps } from "../model/dashboard-overview-types";
import { useDashboardOverview } from "../model/use-dashboard-overview";

import { DashboardActivitySection } from "./dashboard-activity-section";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardHeroSection } from "./dashboard-hero-section";
import { DashboardPracticeSection } from "./dashboard-practice-section";
import { DashboardProgressSection } from "./dashboard-progress-section";
import { DashboardResourceSection } from "./dashboard-resource-section";
import { DashboardReviewSection } from "./dashboard-review-section";

export function DashboardOverview({ content }: DashboardOverviewProps) {
  const overview = useDashboardOverview(content);
  const isDesktopDashboard = useMediaQuery("(min-width: 1280px)");

  if (overview.allBlocks.length === 0) {
    return <DashboardEmptyState />;
  }

  const resourceSection = (
    <DashboardResourceSection
      busyAction={overview.busyAction}
      focusBlockState={overview.focusBlockState}
      focusResource={overview.focusResource}
      focusResourceEntry={overview.focusResourceEntry}
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

  const progressSection = (
    <DashboardProgressSection
      activeDaysThisWeek={overview.activeDaysThisWeek}
      completedBlocks={overview.completedBlocks}
      consistencyLabel={overview.consistencyLabel}
      content={content}
      roadmapCompletion={overview.roadmapCompletion}
      strongestSkill={overview.strongestSkill}
      weakestSkill={overview.weakestSkill}
    />
  );

  const practiceSection = (
    <DashboardPracticeSection
      busyAction={overview.busyAction}
      draftCount={overview.drafts.length}
      draftForWritingTask={overview.draftForWritingTask}
      draftNotice={overview.draftNotice}
      events={overview.events}
      nextSpeakingPrompt={overview.nextSpeakingPrompt}
      nextWritingTask={overview.nextWritingTask}
      onCreateDraft={overview.handleCreateDraft}
    />
  );

  const activitySection = (
    <DashboardActivitySection
      blockProgressCount={overview.blockProgressCount}
      localStateLoading={overview.localStateLoading}
      recentActivity={overview.recentActivity}
      resourceProgressCount={overview.resourceProgressCount}
    />
  );

  if (isDesktopDashboard) {
    return (
      <section className="space-y-[var(--layout-gap)]">
        <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.35fr)_20rem]">
          <div className="animate-stagger-fade-in stagger-1">
            <DashboardHeroSection
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
          </div>
        </div>

        <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="animate-stagger-fade-in stagger-4">{progressSection}</div>
          <div className="animate-stagger-fade-in stagger-5">{practiceSection}</div>
          <div className="animate-stagger-fade-in stagger-6">{activitySection}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-[var(--layout-gap)]">
      <div className="animate-stagger-fade-in stagger-1">
        <DashboardHeroSection
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
      <div className="animate-stagger-fade-in stagger-2">{progressSection}</div>
      <div className="animate-stagger-fade-in stagger-3">{resourceSection}</div>
      <div className="animate-stagger-fade-in stagger-4">{reviewSection}</div>
      <div className="animate-stagger-fade-in stagger-5">{practiceSection}</div>
      <div className="animate-stagger-fade-in stagger-6">{activitySection}</div>
    </section>
  );
}
