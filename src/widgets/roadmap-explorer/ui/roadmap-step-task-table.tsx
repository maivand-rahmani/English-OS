"use client";

import { ArrowUpRight, BookOpenText, CheckCircle2, PenLine, RotateCcw } from "lucide-react";

import type { DashboardBlock } from "@/entities/dashboard";
import { cn } from "@/shared/lib/utils";
import type { RoadmapVisualState } from "../model/roadmap-view";
import { humanizeState } from "../model/roadmap-view";

type RoadmapStepTaskTableProps = {
  block: DashboardBlock;
  state: RoadmapVisualState;
};

export function RoadmapStepTaskTable({ block, state }: RoadmapStepTaskTableProps) {
  const primaryResource = block.resources[0];
  const primarySkill = block.skills.find((skill) => skill.emphasis === "primary") ?? block.skills[0];
  const rows = [
    {
      action: "Complete one focused beginner activity",
      icon: BookOpenText,
      resource: primaryResource?.title ?? "Roadmap note",
      skill: primarySkill?.title ?? "Foundation",
      status: state === "completed" ? "Done" : humanizeState(state),
    },
    {
      action: "Save or repeat the five hardest items",
      icon: PenLine,
      resource: block.resources[1]?.title ?? primaryResource?.title ?? "Your notes",
      skill: primarySkill?.title ?? "Practice",
      status: state === "difficult" ? "Priority" : "Open",
    },
    {
      action: "Decide the step status before moving on",
      icon: RotateCcw,
      resource: "English OS",
      skill: "Control",
      status: state === "needs_review" ? "Review" : "Ready",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-surface-stroke-strong bg-surface-panel-muted">
      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(7rem,0.9fr)_minmax(6rem,0.7fr)_minmax(5.5rem,0.55fr)] border-b border-surface-stroke-strong bg-surface-panel px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground max-lg:hidden">
        <span>Task</span>
        <span>Resource</span>
        <span>Skill</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-surface-stroke-strong">
        {rows.map((row) => {
          const Icon = row.icon;

          return (
            <div
              className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[minmax(0,1.6fr)_minmax(7rem,0.9fr)_minmax(6rem,0.7fr)_minmax(5.5rem,0.55fr)] lg:items-center"
              key={row.action}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-control">
                  <Icon className="size-3.5" />
                </span>
                <span className="font-medium text-foreground">{row.action}</span>
              </div>
              <span className="text-muted-foreground">{row.resource}</span>
              <span className="text-muted-foreground">{row.skill}</span>
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                  row.status === "Done"
                    ? "border-surface-stroke-strong bg-surface-module-green text-foreground"
                    : "border-surface-stroke-strong bg-surface-pill text-muted-foreground",
                )}
              >
                {row.status === "Done" ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <ArrowUpRight className="size-3" />
                )}
                {row.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
