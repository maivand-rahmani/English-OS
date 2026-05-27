import { Activity, ArrowRight } from "lucide-react";

import type { ActivityItem } from "../model/dashboard-overview-types";
import { DashboardCard, SectionEyebrow } from "@/shared/ui/surfaces";

type DashboardActivitySectionProps = {
  blockProgressCount: number;
  localStateLoading: boolean;
  recentActivity: ActivityItem[];
  resourceProgressCount: number;
};

export function DashboardActivitySection({
  blockProgressCount,
  localStateLoading,
  recentActivity,
  resourceProgressCount,
}: DashboardActivitySectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={Activity}>Recent activity</SectionEyebrow>
      <div className="mt-5 grid gap-3">
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.2rem] border border-white/70 bg-surface-2 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.when}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-black/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
            Your local event feed will start filling after you begin a roadmap
            block, complete a resource, or submit practice.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[1.2rem] border border-white/70 bg-surface-2 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Live local state</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {localStateLoading
              ? "Syncing browser persistence..."
              : `${blockProgressCount} block entries / ${resourceProgressCount} resource entries`}
          </p>
        </div>
        <ArrowRight className="size-4 text-muted-foreground" />
      </div>
    </DashboardCard>
  );
}
