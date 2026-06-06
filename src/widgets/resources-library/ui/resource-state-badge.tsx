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
  completed: "border-emerald-200 bg-emerald-50/90 text-emerald-700",
  in_progress: "border-sky-200 bg-sky-50/90 text-sky-700",
  needs_review: "border-amber-200 bg-amber-50/90 text-amber-700",
  not_started: "border-surface-stroke-strong bg-surface-pill text-muted-foreground",
  skipped_for_now: "border-slate-200 bg-slate-100/90 text-slate-500",
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
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          <CheckCircle2 className="size-3.5" />
          Useful
        </span>
      ) : null}
      {isDifficult ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
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
