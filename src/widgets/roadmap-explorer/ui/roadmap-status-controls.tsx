"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleSlash,
  Play,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { BlockState } from "@/shared/types";
import type { RoadmapVisualState } from "../model/roadmap-view";
import { getNextAction } from "../model/roadmap-view";

export type RoadmapStatusAction = "start" | "complete" | "review" | "difficult" | "skip" | "reset";

type RoadmapStatusControlsProps = {
  busy: boolean;
  state: RoadmapVisualState;
  onChange: (state: BlockState, action: RoadmapStatusAction) => Promise<void>;
};

export function RoadmapStatusControls({ busy, state, onChange }: RoadmapStatusControlsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <Button
        disabled={busy}
        onClick={() => void onChange("in_progress", "start")}
        size="sm"
      >
        <Play className="size-4" />
        {getNextAction(state)}
      </Button>
      <Button
        disabled={busy}
        onClick={() => void onChange("completed", "complete")}
        size="sm"
        variant="secondary"
      >
        <CheckCircle2 className="size-4" />
        Mark completed
      </Button>
      <Button
        disabled={busy}
        onClick={() => void onChange("not_started", "reset")}
        size="sm"
        variant="outline"
      >
        <Circle className="size-4" />
        Not completed
      </Button>
      <Button
        disabled={busy}
        onClick={() => void onChange("difficult", "difficult")}
        size="sm"
        variant="outline"
      >
        <AlertTriangle className="size-4" />
        Mark difficult
      </Button>
      <Button
        disabled={busy}
        onClick={() => void onChange("needs_review", "review")}
        size="sm"
        variant="outline"
      >
        <RotateCcw className="size-4" />
        Needs review
      </Button>
      <Button
        disabled={busy}
        onClick={() => void onChange("skipped_for_now", "skip")}
        size="sm"
        variant="ghost"
      >
        <CircleSlash className="size-4" />
        Skip for now
      </Button>
    </div>
  );
}
