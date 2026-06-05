"use client";

import { motion } from "framer-motion";
import {
  BookOpenText,
  CheckCircle2,
  Headphones,
  MessageCircle,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { RoadmapStep, RoadmapVisualState } from "../model/roadmap-view";
import {
  formatMinutes,
  getNextAction,
  getPrimarySkill,
  getProgressValue,
  humanizeState,
} from "../model/roadmap-view";
import { RoadmapProgressRing } from "./roadmap-progress-ring";
import { RoadmapStateBadge } from "./roadmap-state-badge";

type RoadmapStepNodeProps = {
  isCurrent: boolean;
  onOpen: () => void;
  onPreviewChange: (index: number | null) => void;
  state: RoadmapVisualState;
  step: RoadmapStep;
  total: number;
};

const stateClasses = {
  not_started: "border-slate-200 bg-white/76 text-slate-700 shadow-panel",
  current: "border-sky-200 bg-sky-50/85 text-sky-900 shadow-[0_18px_46px_rgba(14,165,233,0.18)]",
  in_progress: "border-indigo-200 bg-indigo-50/85 text-indigo-900 shadow-[0_18px_46px_rgba(99,102,241,0.16)]",
  completed: "border-emerald-200 bg-emerald-50/90 text-emerald-900 shadow-[0_18px_46px_rgba(16,185,129,0.14)]",
  difficult: "border-rose-200 bg-rose-50/90 text-rose-900 shadow-[0_18px_46px_rgba(244,63,94,0.14)]",
  needs_review: "border-amber-200 bg-amber-50/90 text-amber-900 shadow-[0_18px_46px_rgba(245,158,11,0.15)]",
  skipped_for_now: "border-slate-200 bg-slate-100/70 text-slate-500 opacity-70 shadow-panel",
  locked_later: "border-slate-200 bg-white/45 text-slate-400 opacity-65 shadow-panel",
};

const ringTones = {
  not_started: "muted",
  current: "blue",
  in_progress: "blue",
  completed: "green",
  difficult: "rose",
  needs_review: "amber",
  skipped_for_now: "muted",
  locked_later: "muted",
} as const;

export function RoadmapStepNode({
  isCurrent,
  onOpen,
  onPreviewChange,
  state,
  step,
}: RoadmapStepNodeProps) {
  const primarySkill = getPrimarySkill(step.block);
  const skillLabel = primarySkill?.title ?? step.block.blockTypeLabel;
  const progress = getProgressValue(state);
  const resourceNames = step.block.resources.map((resource) => resource.title).join(", ");

  return (
    <motion.div
      className="group roadmap-node-wrap relative w-full"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(step.index * 0.025, 0.35),
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        aria-label={`Step ${step.index + 1}: ${step.block.title}. ${humanizeState(state)}.`}
        className={cn(
          "group relative w-full rounded-[1.6rem] border p-3 text-left backdrop-blur-xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 lg:hover:-translate-y-1",
          stateClasses[state],
          isCurrent && "roadmap-active-node",
        )}
        onBlur={() => onPreviewChange(null)}
        onClick={onOpen}
        onFocus={() => onPreviewChange(step.index)}
        onMouseEnter={() => onPreviewChange(step.index)}
        onMouseLeave={() => onPreviewChange(null)}
        type="button"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex size-[4.5rem] shrink-0 items-center justify-center rounded-full bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_28px_rgba(31,35,48,0.08)]">
            <RoadmapProgressRing progress={progress} tone={ringTones[state]} />
            <SkillGlyph label={skillLabel} />
            {state === "completed" ? (
              <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-control">
                <CheckCircle2 className="size-3.5" />
              </span>
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Step {step.index + 1} / {step.stage.title}
            </span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-foreground">
              {step.block.title}
            </span>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RoadmapStateBadge state={state} />
          {step.block.cefrLabel ? (
            <span className="rounded-full border border-surface-stroke-strong bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {step.block.cefrLabel}
            </span>
          ) : null}
          {step.block.resources.length ? (
            <span className="rounded-full border border-surface-stroke-strong bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {step.block.resources.length} resource
            </span>
          ) : null}
        </div>
      </button>
      <span className="sr-only">
        Skill: {primarySkill?.title ?? "General English"}. Resources:{" "}
        {resourceNames || "None attached"}. Next action: {getNextAction(state)}.
        Effort: {formatMinutes(step.block.estimatedMinutes)}.
      </span>
    </motion.div>
  );
}

function SkillGlyph({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("listening")) return <Headphones className="size-5" />;
  if (normalized.includes("speaking")) return <MessageCircle className="size-5" />;
  if (normalized.includes("writing")) return <PenLine className="size-5" />;
  if (normalized.includes("vocabulary")) return <Search className="size-5" />;
  if (normalized.includes("reading")) return <BookOpenText className="size-5" />;

  return <Sparkles className="size-5" />;
}
