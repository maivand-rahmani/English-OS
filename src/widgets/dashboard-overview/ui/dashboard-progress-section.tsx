import { Activity, Clock3, TrendingDown, TrendingUp } from "lucide-react";

import type { DashboardContentState } from "@/entities/dashboard";

import { DashboardCard, MetricTile, SectionEyebrow } from "@/shared/ui/surfaces";

type DashboardProgressSectionProps = {
  activeDaysThisWeek: number;
  completedBlocks: number;
  consistencyLabel: string;
  content: DashboardContentState;
  roadmapCompletion: number;
  strongestSkill: string | undefined;
  weakestSkill: string | null;
};

export function DashboardProgressSection({
  activeDaysThisWeek,
  completedBlocks,
  consistencyLabel,
  content,
  roadmapCompletion,
  strongestSkill,
  weakestSkill,
}: DashboardProgressSectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={TrendingUp}>Progress snapshot</SectionEyebrow>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold text-foreground">{roadmapCompletion}%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {completedBlocks} of {content.blockCount} roadmap blocks completed
          </p>
        </div>
        <div className="rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel-muted px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Consistency
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{consistencyLabel}</p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-pill">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]"
          style={{ width: `${roadmapCompletion}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricTile
          tone="default"
          icon={Activity}
          label="Active days this week"
          value={`${activeDaysThisWeek}/7`}
          detail="Counted from your local learning events."
        />
        <MetricTile
          tone="default"
          icon={Clock3}
          label="Curated path size"
          value={`${content.stageCount} stages`}
          detail={`${content.blockCount} blocks / ${content.resourceCount} linked resources`}
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
          icon={TrendingDown}
          label="Current friction"
          value={weakestSkill ?? "No urgent weak area"}
          detail="Driven by needs-review and difficulty signals."
        />
      </div>
    </DashboardCard>
  );
}
