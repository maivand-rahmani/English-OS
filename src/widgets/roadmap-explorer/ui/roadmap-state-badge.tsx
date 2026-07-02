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
  not_started: "border-surface-stroke-strong bg-surface-pill text-muted-foreground",
  current: "border-surface-stroke-strong bg-surface-module-blue text-foreground",
  in_progress: "border-surface-stroke-strong bg-surface-module-lavender text-foreground",
  completed: "border-surface-stroke-strong bg-surface-module-green text-foreground",
  difficult: "border-surface-stroke-strong bg-surface-module-pink text-foreground",
  needs_review: "border-surface-stroke-strong bg-surface-module-cream text-foreground",
  skipped_for_now: "border-surface-stroke-strong bg-surface-panel-muted text-muted-foreground",
  locked_later: "border-surface-stroke bg-surface-panel-muted text-muted-foreground",
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
