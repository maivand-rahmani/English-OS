"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { BlockState } from "@/shared/types";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { RoadmapCanvas } from "./roadmap-canvas";
import { RoadmapStepModal } from "./roadmap-step-modal";
import type { RoadmapStatusAction } from "./roadmap-status-controls";
import {
  buildRoadmapSteps,
  getCurrentStepIndex,
  getStepVisualState,
  toBlockTarget,
  type RoadmapStep,
} from "../model/roadmap-view";
import { useRoadmapExplorer } from "../model/use-roadmap-explorer";
import type { RoadmapExplorerProps } from "../model/roadmap-explorer-types";

export function RoadmapExplorer(props: RoadmapExplorerProps) {
  const roadmap = useRoadmapExplorer(props);
  const reduced = useReducedMotion();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const steps = useMemo(() => buildRoadmapSteps(roadmap.stages), [roadmap.stages]);
  const selectedStep = steps.find((step) => step.block.id === selectedStepId) ?? null;
  const currentStepIndex = getCurrentStepIndex(steps, roadmap.progressById);
  const selectedState = selectedStep
    ? getStepVisualState(selectedStep, roadmap.progressById, currentStepIndex)
    : "not_started";
  const selectedBusy = selectedStep
    ? (roadmap.busyAction?.startsWith(`block:${selectedStep.block.id}:`) ?? false)
    : false;

  async function handleStatusChange(nextState: BlockState, action: RoadmapStatusAction) {
    if (!selectedStep) return;

    await roadmap.updateBlockState(toBlockTarget(selectedStep.block), nextState, action);
  }

  if (steps.length === 0) {
    return (
      <section className="min-h-[calc(100vh-11rem)] rounded-[2.2rem] border border-surface-stroke bg-surface-panel-strong p-6 shadow-float backdrop-blur-2xl">
        <div className="flex h-full min-h-[24rem] items-center justify-center rounded-[1.7rem] border border-dashed border-surface-stroke-strong bg-white/45 text-center">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Roadmap canvas
            </p>
            <p className="mt-3 text-lg font-semibold text-foreground">
              No roadmap steps are available yet.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Once curated steps load, this page becomes the interactive learning map.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const content = (
    <>
      <RoadmapCanvas
        completedBlocks={roadmap.completedBlocks}
        content={props.content}
        onOpenStep={(step: RoadmapStep) => setSelectedStepId(step.block.id)}
        progressById={roadmap.progressById}
        roadmapCompletion={roadmap.roadmapCompletion}
        steps={steps}
      />
      <RoadmapStepModal
        busy={selectedBusy}
        onClose={() => setSelectedStepId(null)}
        onStatusChange={handleStatusChange}
        state={selectedState}
        step={selectedStep}
      />
    </>
  );

  if (reduced) {
    return content;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
