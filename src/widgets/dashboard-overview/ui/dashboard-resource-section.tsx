import { BookOpenText } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { BlockState, ProgressEntry } from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  SectionEyebrow,
  SmallTag,
} from "@/shared/ui/surfaces";

import type { ResourceWithContext } from "../model/dashboard-overview-types";
import {
  formatMinutes,
  getResourceReason,
} from "../model/dashboard-overview-formatters";

type DashboardResourceSectionProps = {
  busyAction: string | null;
  focusBlockState: BlockState;
  focusResource: ResourceWithContext | null;
  focusResourceEntry: ProgressEntry | undefined;
  onCompleteResource: (resource: ResourceWithContext) => void;
  onMarkResourceDifficult: (resource: ResourceWithContext) => void;
  onStartResource: (resource: ResourceWithContext) => void;
};

export function DashboardResourceSection({
  busyAction,
  focusBlockState,
  focusResource,
  focusResourceEntry,
  onCompleteResource,
  onMarkResourceDifficult,
  onStartResource,
}: DashboardResourceSectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={BookOpenText}>Best next resource</SectionEyebrow>
      {focusResource ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SmallTag>{focusResource.role}</SmallTag>
            <SmallTag>{focusResource.resourceTypeLabel}</SmallTag>
            <SmallTag>{formatMinutes(focusResource.estimatedMinutes)}</SmallTag>
            <span className="text-xs text-muted-foreground">
              {focusResource.sourceName}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            {focusResource.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {focusResource.primaryUseCaseLabel}
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {getResourceReason(
              focusResource,
              focusResourceEntry,
              focusBlockState,
            )}
          </p>

          <div className="mt-4 rounded-[1.25rem] border border-surface-stroke-strong bg-surface-panel-muted p-4">
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

          <div className="mobile-stacked-actions mt-5">
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
                "rounded-full border-surface-stroke-strong bg-surface-panel",
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
                "rounded-full border border-transparent text-foreground hover:bg-surface-pill",
              )}
            >
              Mark difficult
            </button>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The current step does not have a linked resource yet.
        </p>
      )}
    </DashboardCard>
  );
}
