import Link from "next/link";
import { Activity, Mic, PenSquare, TrendingUp } from "lucide-react";

import type {
  ActivityItem,
  SpeakingPromptWithContext,
  WritingTaskWithContext,
} from "../model/dashboard-overview-types";

import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { DashboardCard, MetricTile, SectionEyebrow } from "@/shared/ui/surfaces";

type DashboardProgressActivitySectionProps = {
  activeDaysThisWeek: number;
  consistencyLabel: string;
  roadmapCompletion: number;
  strongestSkill: string | undefined;
  weakestSkill: string | null;
  recentActivity: ActivityItem[];
  nextWritingTask: WritingTaskWithContext | null;
  nextSpeakingPrompt: SpeakingPromptWithContext | null;
};

export function DashboardProgressActivitySection({
  activeDaysThisWeek,
  consistencyLabel,
  roadmapCompletion,
  strongestSkill,
  weakestSkill,
  recentActivity,
  nextWritingTask,
  nextSpeakingPrompt,
}: DashboardProgressActivitySectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={TrendingUp}>Progress snapshot</SectionEyebrow>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold text-foreground">
            {roadmapCompletion}%
          </p>
        </div>
        <div className="rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel-muted px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Consistency
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {consistencyLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-pill">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]"
          style={{ width: `${roadmapCompletion}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricTile
          tone="default"
          icon={Activity}
          label="Active days this week"
          value={`${activeDaysThisWeek}/7`}
          detail="Counted from your local learning events."
        />
        <MetricTile
          tone="default"
          icon={TrendingUp}
          label="Strongest current area"
          value={strongestSkill ?? "Still emerging"}
          detail="Weighted more heavily toward completed and active blocks."
        />
        <MetricTile
          tone="default"
          icon={TrendingUp}
          label="Current friction"
          value={weakestSkill ?? "No urgent weak area"}
          detail="Driven by needs-review and difficulty signals."
        />
      </div>

      <div className="mt-6">
        <SectionEyebrow icon={Activity}>Recent activity</SectionEyebrow>

        <div className="mt-4 grid gap-3">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel-muted px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.when}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-surface-stroke-strong bg-surface-panel-muted px-4 py-4 text-sm leading-6 text-muted-foreground">
              Your local event feed will start filling after you begin a roadmap
              block, complete a resource, or submit practice.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/practice?mode=writing"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full",
          )}
        >
          <PenSquare className="mr-1.5 size-4" />
          {nextWritingTask ? "Write now" : "Open writing"}
        </Link>
        <Link
          href="/practice?mode=speaking"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-full",
          )}
        >
          <Mic className="mr-1.5 size-4" />
          {nextSpeakingPrompt ? "Speak now" : "Open speaking"}
        </Link>
      </div>
    </DashboardCard>
  );
}
