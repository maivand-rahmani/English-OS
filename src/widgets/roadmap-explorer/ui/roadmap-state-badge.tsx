"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleSlash,
  Clock3,
  Lock,
  PlayCircle,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { RoadmapVisualState } from "../model/roadmap-view";
import { humanizeState } from "../model/roadmap-view";

type RoadmapStateBadgeProps = {
  className?: string;
  state: RoadmapVisualState;
};

const stateStyles = {
  not_started: "border-slate-200 bg-white/70 text-slate-600",
  current: "border-sky-200 bg-sky-50/90 text-sky-700",
  in_progress: "border-indigo-200 bg-indigo-50/90 text-indigo-700",
  completed: "border-emerald-200 bg-emerald-50/90 text-emerald-700",
  difficult: "border-rose-200 bg-rose-50/90 text-rose-700",
  needs_review: "border-amber-200 bg-amber-50/90 text-amber-700",
  skipped_for_now: "border-slate-200 bg-slate-100/80 text-slate-500",
  locked_later: "border-slate-200 bg-white/45 text-slate-400",
};

const stateIcons = {
  not_started: Circle,
  current: PlayCircle,
  in_progress: Clock3,
  completed: CheckCircle2,
  difficult: AlertTriangle,
  needs_review: RotateCcw,
  skipped_for_now: CircleSlash,
  locked_later: Lock,
};

export function RoadmapStateBadge({ className, state }: RoadmapStateBadgeProps) {
  const Icon = stateIcons[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        stateStyles[state],
        className,
      )}
    >
      <Icon className="size-3.5" />
      {humanizeState(state)}
    </span>
  );
}
