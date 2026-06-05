"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { BlockState } from "@/shared/types";
import { Button } from "@/shared/ui/button";
import { SmallTag } from "@/shared/ui/surfaces";
import { ConnectedResourceMiniCard } from "./connected-resource-mini-card";
import type { RoadmapStatusAction } from "./roadmap-status-controls";
import { RoadmapStatusControls } from "./roadmap-status-controls";
import { RoadmapStateBadge } from "./roadmap-state-badge";
import { RoadmapStepTaskTable } from "./roadmap-step-task-table";
import type { RoadmapStep, RoadmapVisualState } from "../model/roadmap-view";
import {
  formatMinutes,
  getPrimarySkill,
  getProgressValue,
  humanizeState,
} from "../model/roadmap-view";

type RoadmapStepModalProps = {
  busy: boolean;
  onClose: () => void;
  onStatusChange: (state: BlockState, action: RoadmapStatusAction) => Promise<void>;
  state: RoadmapVisualState;
  step: RoadmapStep | null;
};

const identityClasses = [
  "from-sky-100 via-white to-emerald-100",
  "from-violet-100 via-white to-amber-100",
  "from-cyan-100 via-white to-blue-100",
  "from-rose-100 via-white to-lime-100",
  "from-amber-100 via-white to-indigo-100",
];

export function RoadmapStepModal({
  busy,
  onClose,
  onStatusChange,
  state,
  step,
}: RoadmapStepModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!step) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    window.setTimeout(() => {
      modalRef.current
        ?.querySelector<HTMLElement>(
          "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])",
        )
        ?.focus();
    }, 0);

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [step]);

  useEffect(() => {
    if (!step) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, step]);

  if (!step || typeof document === "undefined") {
    return null;
  }

  async function handleStatusChange(
    nextState: BlockState,
    action: RoadmapStatusAction,
  ) {
    await onStatusChange(nextState, action);
    setFeedback(`${humanizeState(nextState)} saved`);
    window.setTimeout(() => setFeedback(null), 1800);
  }

  const identity = identityClasses[step.index % identityClasses.length];
  const primarySkill = getPrimarySkill(step.block);

  return createPortal(
    <div
      aria-labelledby="roadmap-step-modal-title"
      aria-modal="true"
      className="flex items-center justify-center bg-slate-950/58 p-3 backdrop-blur-sm sm:p-6"
      data-roadmap-modal-overlay="true"
      onClick={onClose}
      role="dialog"
      style={{
        bottom: 0,
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 2147483647,
      }}
    >
      <div
        className={`relative max-h-[min(92vh,56rem)] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-surface-stroke-strong bg-gradient-to-br ${identity} p-4 text-foreground shadow-[0_34px_120px_rgba(15,23,42,0.38)] outline-none sm:p-6`}
        data-roadmap-modal-panel="true"
        data-theme="light"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-12 size-40 rounded-full bg-white/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 left-8 size-44 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <SmallTag>Step {step.index + 1}</SmallTag>
              <SmallTag>{step.stage.title}</SmallTag>
              {step.block.cefrLabel ? <SmallTag>{step.block.cefrLabel}</SmallTag> : null}
              <SmallTag>{formatMinutes(step.block.estimatedMinutes)}</SmallTag>
            </div>
            <h2
              className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              id="roadmap-step-modal-title"
            >
              {step.block.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoadmapStateBadge state={state} />
              <SmallTag>{getProgressValue(state)}% step progress</SmallTag>
              {primarySkill ? <SmallTag>{primarySkill.title}</SmallTag> : null}
            </div>
          </div>
          <Button aria-label="Close step details" onClick={onClose} size="icon" variant="ghost">
            <X className="size-5" />
          </Button>
        </div>

        <div className="relative mt-6 grid gap-5">
          <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/50 p-4 shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Step purpose
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground">
              {step.block.purpose ??
                step.block.summary ??
                "This step keeps the roadmap focused and actionable."}
            </p>
            {step.block.whyNow ? (
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                {step.block.whyNow}
              </p>
            ) : null}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Task checklist
              </p>
              <SmallTag>{humanizeState(state)}</SmallTag>
            </div>
            <RoadmapStepTaskTable block={step.block} state={state} />
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Connected resources
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {step.block.resources.map((resource) => (
                <ConnectedResourceMiniCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/55 p-4 shadow-panel">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Status controls
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update this step without leaving the roadmap.
                </p>
              </div>
              {feedback ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {feedback}
                </span>
              ) : null}
            </div>
            <RoadmapStatusControls busy={busy} onChange={handleStatusChange} state={state} />
          </section>

          <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Next step guidance
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground">
              {state === "completed"
                ? "Move to the next unfinished step. If this still feels fragile, mark it needs review before continuing."
                : "Use the controls above to make the roadmap honest: start it, complete it, flag difficulty, review it, or skip it for now."}
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
