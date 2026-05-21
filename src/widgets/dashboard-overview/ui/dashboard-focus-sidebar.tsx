import Link from "next/link";
import { BookOpenText, RotateCcw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { BlockState, ProgressEntry } from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";

import type { ResourceWithContext, ReviewPreviewItem } from "../model/dashboard-overview-types";
import {
  formatMinutes,
  getResourceReason,
} from "../model/dashboard-overview-formatters";
import { DashboardCard, SectionEyebrow, SmallTag } from "./dashboard-surfaces";

type DashboardFocusSidebarProps = {
  busyAction: string | null;
  focusBlockState: BlockState;
  focusResource: ResourceWithContext | null;
  focusResourceEntry: ProgressEntry | undefined;
  reviewHeadline: string;
  reviewPreviewItems: ReviewPreviewItem[];
  onCompleteResource: (resource: ResourceWithContext) => void;
  onMarkResourceDifficult: (resource: ResourceWithContext) => void;
  onStartResource: (resource: ResourceWithContext) => void;
};

export function DashboardFocusSidebar({
  busyAction,
  focusBlockState,
  focusResource,
  focusResourceEntry,
  reviewHeadline,
  reviewPreviewItems,
  onCompleteResource,
  onMarkResourceDifficult,
  onStartResource,
}: DashboardFocusSidebarProps) {
  return (
    <div className="space-y-[var(--layout-gap)]">
      <DashboardCard className="p-5">
        <SectionEyebrow icon={BookOpenText}>Best next resource</SectionEyebrow>
        {focusResource ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <SmallTag>{focusResource.role}</SmallTag>
              <SmallTag>{focusResource.resourceTypeLabel}</SmallTag>
              <SmallTag>{formatMinutes(focusResource.estimatedMinutes)}</SmallTag>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {focusResource.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {focusResource.sourceName} / {focusResource.primaryUseCaseLabel}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {getResourceReason(focusResource, focusResourceEntry, focusBlockState)}
            </p>

            <div className="mt-4 rounded-[1.25rem] border border-white/70 bg-[var(--surface-2)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Supports
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {focusResource.blockTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {focusResource.note ?? focusResource.bestUseCase}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onStartResource(focusResource)}
                disabled={busyAction === `resource:${focusResource.id}:start`}
                className={cn(buttonVariants(), "rounded-full")}
              >
                Start resource
              </button>
              <button
                type="button"
                onClick={() => onCompleteResource(focusResource)}
                disabled={busyAction === `resource:${focusResource.id}:complete`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full border-white/70 bg-white/80",
                )}
              >
                Mark useful and done
              </button>
              <button
                type="button"
                onClick={() => onMarkResourceDifficult(focusResource)}
                disabled={busyAction === `resource:${focusResource.id}:difficult`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-full border border-transparent text-foreground hover:bg-black/5",
                )}
              >
                Mark difficult
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The current block does not have a linked resource yet.
          </p>
        )}
      </DashboardCard>

      <DashboardCard className="p-5">
        <SectionEyebrow icon={RotateCcw}>Review preview</SectionEyebrow>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {reviewPreviewItems.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{reviewHeadline}</p>
          </div>
          <Link
            href="/roadmap"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-full px-3 text-foreground hover:bg-black/5",
            )}
          >
            Open roadmap
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {reviewPreviewItems.length > 0 ? (
            reviewPreviewItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.context}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.urgency}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-black/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
              Review pressure will appear here when you mark a block or
              resource difficult, skip something, or explicitly set it to
              needs review.
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
