"use client";

import type { DashboardOverviewProps } from "../model/dashboard-overview-types";
import { useDashboardOverview } from "../model/use-dashboard-overview";
import { DashboardActivitySection } from "./dashboard-activity-section";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardFocusSidebar } from "./dashboard-focus-sidebar";
import { DashboardHeroSection } from "./dashboard-hero-section";
import { DashboardPracticeSection } from "./dashboard-practice-section";

export function DashboardOverview({ content }: DashboardOverviewProps) {
  const overview = useDashboardOverview(content);

  if (overview.allBlocks.length === 0) {
    return <DashboardEmptyState />;
  }

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

        <div className="animate-stagger-fade-in stagger-2">
          <DashboardFocusSidebar
            busyAction={overview.busyAction}
            focusBlockState={overview.focusBlockState}
            focusResource={overview.focusResource}
            focusResourceEntry={overview.focusResourceEntry}
            reviewHeadline={overview.reviewHeadline}
            reviewPreviewItems={overview.reviewPreviewItems}
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
        </div>
      </div>

      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="animate-stagger-fade-in stagger-3">
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
        </div>

        <div className="animate-stagger-fade-in stagger-4">
          <DashboardActivitySection
            blockProgressCount={overview.blockProgressCount}
            localStateLoading={overview.localStateLoading}
            recentActivity={overview.recentActivity}
            resourceProgressCount={overview.resourceProgressCount}
          />
        </div>
      </div>
    </section>
  );
}
