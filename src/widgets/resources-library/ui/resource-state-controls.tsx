"use client";

import {
  CheckCircle2,
  CircleSlash,
  Play,
  RotateCcw,
  Sparkles,
  TriangleAlert,
  Undo2,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import type {
  LibraryResource,
  ResourcePrimaryAction,
} from "../model/use-resources-library";

type ResourceStateControlsProps = {
  busy: boolean;
  onAction: (action: ResourcePrimaryAction) => Promise<void>;
  resource: LibraryResource;
};

export function ResourceStateControls({
  busy,
  onAction,
  resource,
}: ResourceStateControlsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <Button
        disabled={busy}
        size="sm"
        variant={resource.signal.state === "in_progress" ? "secondary" : "outline"}
        onClick={() => void onAction("start")}
      >
        <Play className="size-4" />
        Start resource
      </Button>
      <Button
        disabled={busy}
        size="sm"
        variant={resource.signal.state === "completed" ? "secondary" : "outline"}
        onClick={() => void onAction("complete")}
      >
        <CheckCircle2 className="size-4" />
        Mark completed
      </Button>
      <Button
        disabled={busy}
        size="sm"
        variant={resource.signal.isUseful ? "secondary" : "outline"}
        onClick={() => void onAction("useful")}
      >
        <Sparkles className="size-4" />
        Mark useful
      </Button>
      <Button
        disabled={busy}
        size="sm"
        variant={resource.signal.isDifficult ? "secondary" : "outline"}
        onClick={() => void onAction("difficult")}
      >
        <TriangleAlert className="size-4" />
        Mark difficult
      </Button>
      <Button disabled={busy} size="sm" variant="outline" onClick={() => void onAction("review")}>
        <RotateCcw className="size-4" />
        Needs review
      </Button>
      <Button disabled={busy} size="sm" variant="ghost" onClick={() => void onAction("skip")}>
        <CircleSlash className="size-4" />
        Skip for now
      </Button>
      <Button disabled={busy} size="sm" variant="ghost" onClick={() => void onAction("reset")}>
        <Undo2 className="size-4" />
        Reset status
      </Button>
    </div>
  );
}
