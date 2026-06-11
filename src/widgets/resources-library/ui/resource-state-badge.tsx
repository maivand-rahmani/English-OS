"use client";

import type { ComponentType } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Clock3,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import type { LibraryResource } from "../model/use-resources-library";
import { cn } from "@/shared/lib/utils";

const stateBadgeStyles: Record<LibraryResource["signal"]["state"], string> = {
  completed: "border-surface-stroke-strong bg-surface-module-green text-foreground",
  in_progress: "border-surface-stroke-strong bg-surface-module-blue text-foreground",
  needs_review: "border-surface-stroke-strong bg-surface-module-cream text-foreground",
  not_started: "border-surface-stroke-strong bg-surface-pill text-muted-foreground",
  skipped_for_now: "border-surface-stroke bg-surface-panel-muted text-muted-foreground",
};

const stateIcons: Record<LibraryResource["signal"]["state"], ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  in_progress: Clock3,
  needs_review: RotateCcw,
  not_started: Sparkles,
  skipped_for_now: CircleSlash,
};

type ResourceStateBadgeProps = {
  className?: string;
  state: LibraryResource["signal"]["state"];
};

export function ResourceStateBadge({ className, state }: ResourceStateBadgeProps) {
  const Icon = stateIcons[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        stateBadgeStyles[state],
        className,
      )}
    >
      <Icon className="size-3.5" />
      {humanizeLabel(state)}
    </span>
  );
}

type ResourceSignalFlagsProps = {
  isDifficult: boolean;
  isUseful: boolean;
};

export function ResourceSignalFlags({
  isDifficult,
  isUseful,
}: ResourceSignalFlagsProps) {
  return (
    <>
      {isUseful ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-surface-stroke-strong bg-surface-module-green px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
          <CheckCircle2 className="size-3.5" />
          Useful
        </span>
      ) : null}
      {isDifficult ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-surface-stroke-strong bg-surface-module-pink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
          <AlertTriangle className="size-3.5" />
          Difficult
        </span>
      ) : null}
    </>
  );
}

function humanizeLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
}
