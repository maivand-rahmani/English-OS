"use client";

import { motion } from "framer-motion";
import { Map, Sparkles, Target } from "lucide-react";
import { useState } from "react";

import type { DashboardContentState } from "@/entities/dashboard";
import { cn } from "@/shared/lib/utils";
import { SmallTag } from "@/shared/ui/surfaces";
import type { ProgressEntry } from "@/shared/types";
import type { RoadmapStep } from "../model/roadmap-view";
import {
  getCurrentStepIndex,
  getStepVisualState,
  humanizeState,
} from "../model/roadmap-view";
import { RoadmapStepNode } from "./roadmap-step-node";

type RoadmapCanvasProps = {
  completedBlocks: number;
  content: DashboardContentState;
  onOpenStep: (step: RoadmapStep) => void;
  progressById: Map<string, ProgressEntry>;
  roadmapCompletion: number;
  steps: RoadmapStep[];
};

export function RoadmapCanvas({
  completedBlocks,
  content,
  onOpenStep,
  progressById,
  roadmapCompletion,
  steps,
}: RoadmapCanvasProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const currentStepIndex = getCurrentStepIndex(steps, progressById);
  const currentStep = steps[currentStepIndex] ?? steps[0] ?? null;
  const stageGroups = groupStepsByStage(steps);

  return (
    <section
      aria-label="Interactive English learning roadmap"
      className="relative min-h-[calc(100vh-11rem)] overflow-hidden rounded-[2.2rem] border border-surface-stroke bg-surface-panel-strong p-4 text-foreground shadow-float backdrop-blur-2xl sm:p-5"
      data-theme="light"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(125,211,252,0.22),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(253,186,116,0.16),transparent_20%),radial-gradient(circle_at_70%_86%,rgba(167,243,208,0.18),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08))]" />

      <RoadmapStatusBar
        completedBlocks={completedBlocks}
        content={content}
        currentStepTitle={currentStep?.block.title ?? "Roadmap complete"}
        roadmapCompletion={roadmapCompletion}
      />

      <div className="relative z-10 mt-5">
        <div className="pointer-events-none absolute bottom-6 left-[1.95rem] top-8 w-px bg-gradient-to-b from-sky-300 via-emerald-300 to-slate-200 md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          aria-hidden="true"
          animate={{ scaleY: 1 }}
          className="pointer-events-none absolute left-[1.95rem] top-8 w-[3px] origin-top rounded-full bg-gradient-to-b from-sky-400 via-emerald-400 to-lime-300 shadow-[0_0_28px_rgba(56,189,248,0.22)] md:left-1/2 md:-translate-x-1/2"
          initial={{ scaleY: 0 }}
          style={{ height: `${Math.max(8, currentStepIndex + 1) * 8.4}rem` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="grid gap-7">
          {stageGroups.map((group, stageIndex) => (
            <section
              className="relative overflow-hidden rounded-[1.8rem] border border-white/65 bg-white/24 px-3 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-sm sm:px-5"
              key={group.stage.id}
            >
              <div className="mb-5 flex flex-wrap items-center gap-2 pl-12 md:justify-center md:pl-0">
                <SmallTag>Stage {stageIndex + 1}</SmallTag>
                <SmallTag>{group.stage.title}</SmallTag>
                <SmallTag>{group.stage.stageTypeLabel}</SmallTag>
                <SmallTag>
                  {group.steps.length} step{group.steps.length === 1 ? "" : "s"}
                </SmallTag>
              </div>

              <div className="grid gap-4">
                {group.steps.map((step) => {
                  const visualState = getStepVisualState(
                    step,
                    progressById,
                    currentStepIndex,
                  );
                  const isCurrent = step.index === currentStepIndex;
                  const side = step.index % 2 === 0 ? "left" : "right";

                  return (
                    <RoadmapFlowRow
                      isCurrent={isCurrent}
                      key={step.block.id}
                      onOpen={() => onOpenStep(step)}
                      onPreviewChange={setPreviewIndex}
                      previewIndex={previewIndex}
                      side={side}
                      state={visualState}
                      step={step}
                      total={steps.length}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

type RoadmapFlowRowProps = {
  isCurrent: boolean;
  onOpen: () => void;
  onPreviewChange: (index: number | null) => void;
  previewIndex: number | null;
  side: "left" | "right";
  state: ReturnType<typeof getStepVisualState>;
  step: RoadmapStep;
  total: number;
};

function RoadmapFlowRow({
  isCurrent,
  onOpen,
  onPreviewChange,
  previewIndex,
  side,
  state,
  step,
  total,
}: RoadmapFlowRowProps) {
  return (
    <div className="relative grid min-h-[9rem] grid-cols-[3.8rem_minmax(0,1fr)] items-center gap-3 md:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] md:gap-5">
      <div
        className={cn(
          "hidden md:block",
          side === "left" ? "md:col-start-1" : "md:col-start-3",
        )}
      >
        <RoadmapStepNode
          isCurrent={isCurrent}
          onOpen={onOpen}
          onPreviewChange={onPreviewChange}
          state={state}
          step={step}
          total={total}
        />
      </div>

      <div className="relative z-10 col-start-1 flex justify-center md:col-start-2">
        <button
          aria-label={`Open step ${step.index + 1}: ${step.block.title}. ${humanizeState(state)}.`}
          className={cn(
            "flex size-12 items-center justify-center rounded-full border bg-white/90 text-sm font-semibold shadow-[0_12px_30px_rgba(31,35,48,0.12)] backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
            isCurrent && "scale-110 border-sky-300 text-sky-700 shadow-[0_18px_42px_rgba(14,165,233,0.20)]",
            state === "completed" && "border-emerald-300 text-emerald-700",
            state === "difficult" && "border-rose-300 text-rose-700",
            state === "needs_review" && "border-amber-300 text-amber-700",
            state === "skipped_for_now" && "opacity-65",
          )}
          onClick={onOpen}
          type="button"
        >
          {step.index + 1}
        </button>
      </div>

      <div className="col-start-2 md:hidden">
        <RoadmapStepNode
          isCurrent={isCurrent}
          onOpen={onOpen}
          onPreviewChange={onPreviewChange}
          state={state}
          step={step}
          total={total}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none hidden rounded-[1.15rem] border border-surface-stroke-strong bg-white/70 p-3 text-xs leading-5 text-muted-foreground opacity-0 shadow-panel backdrop-blur-xl transition-opacity duration-200 md:block",
          side === "left" ? "md:col-start-3" : "md:col-start-1 md:row-start-1",
          previewIndex === step.index && "opacity-100",
        )}
      >
        <p className="font-semibold text-foreground">{step.block.title}</p>
        <p className="mt-1">
          {step.block.summary ?? step.block.purpose ?? "Focused roadmap step."}
        </p>
      </div>
    </div>
  );
}

type RoadmapStatusBarProps = {
  completedBlocks: number;
  content: DashboardContentState;
  currentStepTitle: string;
  roadmapCompletion: number;
};

function RoadmapStatusBar({
  completedBlocks,
  content,
  currentStepTitle,
  roadmapCompletion,
}: RoadmapStatusBarProps) {
  return (
    <div className="relative z-10 rounded-[1.5rem] border border-surface-stroke-strong bg-white/64 px-4 py-3 shadow-panel backdrop-blur-xl">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Map className="size-3.5" />
            <span>{content.templateTitle}</span>
            <span className="text-slate-300">/</span>
            <span>{content.estimatedWeeks ?? 8} week path</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SmallTag>
              <Target className="mr-1 size-3" />
              Current: {currentStepTitle}
            </SmallTag>
            <SmallTag>
              <Sparkles className="mr-1 size-3" />
              {content.learnerLevelLabel} / {content.audienceLabel}
            </SmallTag>
          </div>
        </div>
        <div className="min-w-[13rem]">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
            <span>{roadmapCompletion}% complete</span>
            <span>
              {completedBlocks}/{content.blockCount} steps
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/70">
            <motion.div
              animate={{ width: `${roadmapCompletion}%` }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-lime-300"
              initial={false}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function groupStepsByStage(steps: RoadmapStep[]) {
  return steps.reduce<Array<{ stage: RoadmapStep["stage"]; steps: RoadmapStep[] }>>(
    (groups, step) => {
      const existing = groups.find((group) => group.stage.id === step.stage.id);

      if (existing) {
        existing.steps.push(step);
        return groups;
      }

      return [...groups, { stage: step.stage, steps: [step] }];
    },
    [],
  );
}
