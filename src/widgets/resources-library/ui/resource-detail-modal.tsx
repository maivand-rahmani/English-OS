"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCheck, Link2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { Button, buttonVariants } from "@/shared/ui/button";
import { InsetPanel, SmallTag } from "@/shared/ui/surfaces";
import type {
  LibraryResource,
  ResourcePrimaryAction,
} from "../model/use-resources-library";
import { ResourceSignalFlags, ResourceStateBadge } from "./resource-state-badge";
import { ResourceStateControls } from "./resource-state-controls";

type ResourceDetailModalProps = {
  busy: boolean;
  onAction: (action: ResourcePrimaryAction) => Promise<void>;
  onClose: () => void;
  resource: LibraryResource | null;
};

export function ResourceDetailModal({
  busy,
  onAction,
  onClose,
  resource,
}: ResourceDetailModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!resource) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    window.setTimeout(() => {
      modalRef.current
        ?.querySelector<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        )
        ?.focus();
    }, 0);

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [resource]);

  useEffect(() => {
    if (!resource) {
      return;
    }

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
  }, [onClose, resource]);

  if (!resource || typeof document === "undefined") {
    return null;
  }

  async function handleAction(action: ResourcePrimaryAction) {
    await onAction(action);
    setFeedback(getFeedbackLabel(action));
    window.setTimeout(() => setFeedback(null), 1800);
  }

  return createPortal(
    <div
      aria-labelledby="resource-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/52 p-2 backdrop-blur-sm sm:p-5"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={cn(
          "relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-surface-stroke-strong bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(244,244,252,0.92))] shadow-[0_40px_130px_rgba(15,23,42,0.32)]",
          reducedMotion ? "" : "animate-in fade-in zoom-in-95 duration-300",
        )}
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(255,211,222,0.4),transparent_34%),radial-gradient(circle_at_top_right,rgba(196,212,255,0.34),transparent_30%)]" />
        <div className="relative flex items-start justify-between gap-4 border-b border-surface-stroke px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SmallTag>{resource.sourceName}</SmallTag>
              <SmallTag>{resource.roleLabel}</SmallTag>
              <SmallTag>{resource.formatCategory}</SmallTag>
              {resource.levelTags[0] ? <SmallTag>{resource.levelTags.join(" / ")}</SmallTag> : null}
              <SmallTag>{resource.timeLabel}</SmallTag>
            </div>
            <h2
              className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              id="resource-detail-title"
            >
              {resource.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ResourceStateBadge state={resource.signal.state} />
              <ResourceSignalFlags
                isDifficult={resource.signal.isDifficult}
                isUseful={resource.signal.isUseful}
              />
              {resource.primarySkillLabel ? <SmallTag>{resource.primarySkillLabel}</SmallTag> : null}
              <SmallTag>{resource.accessTypeLabel}</SmallTag>
              <SmallTag>{resource.difficultyLabel}</SmallTag>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              className={buttonVariants({ size: "sm" })}
              href={resource.url}
              rel="noreferrer"
              target="_blank"
            >
              <ArrowUpRight className="size-4" />
              {resource.primaryCtaLabel}
            </a>
            <Button aria-label="Close resource details" onClick={onClose} size="icon" variant="ghost">
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <div className="relative grid min-h-0 gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 xl:grid-cols-[minmax(0,1.25fr)_22rem]">
          <div className="space-y-4">
            <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/65 p-4 shadow-panel">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Why this resource
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                {resource.recommendationReason}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Best for {resource.levelTags.join(" to ") || "your current level"} learners who need{" "}
                {resource.useCaseCategory.toLowerCase()} with a {resource.roleValue} role in the
                roadmap.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Curated inside English OS because {resource.whyRecommended.toLowerCase()}
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/55 p-4 shadow-panel">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                How to use it
              </p>
              <div className="mt-4 grid gap-3">
                {resource.howToUseSteps.map((step) => (
                  <div
                    key={`${resource.id}:${step}`}
                    className="flex gap-3 rounded-[1.15rem] border border-surface-stroke bg-white/70 px-3 py-3"
                  >
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-module-lavender text-foreground">
                      <CheckCheck className="size-3.5" />
                    </span>
                    <p className="text-sm leading-6 text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <InsetPanel className="p-4" tone="lavender">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Skill fit
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.skills.map((skill) => (
                    <SmallTag key={`${resource.id}:${skill.slug}`}>
                      {skill.title}
                      {skill.emphasis === "primary" ? " core" : ""}
                    </SmallTag>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Primary skill: {resource.primarySkillLabel ?? "General English"}
                  {resource.secondarySkillLabels.length
                    ? `. Secondary support: ${resource.secondarySkillLabels.join(", ")}.`
                    : "."}
                </p>
              </InsetPanel>

              <InsetPanel className="p-4" tone="cream">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  What to do after
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">{resource.nextAction}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  After that, return to the linked roadmap block and decide whether to continue,
                  review, or move forward.
                </p>
              </InsetPanel>
            </section>

            <section className="rounded-[1.5rem] border border-surface-stroke-strong bg-white/55 p-4 shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Roadmap connections
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Resources stay connected to the roadmap, but do not replace it.
                  </p>
                </div>
                <Link href="/roadmap" className={buttonVariants({ size: "sm", variant: "outline" })}>
                  Open roadmap
                </Link>
              </div>
              <div className="mt-4 grid gap-3">
                {resource.linkedBlocks.map((block) => (
                  <div
                    key={`${resource.id}:${block.id}`}
                    className="grid gap-3 rounded-[1.15rem] border border-surface-stroke bg-white/72 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {block.stageTitle}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{block.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Status: {block.state.replaceAll("_", " ")}
                      </p>
                    </div>
                    <Link
                      href={`/roadmap#block-${block.id}`}
                      className={buttonVariants({ size: "sm", variant: "outline" })}
                    >
                      <Link2 className="size-4" />
                      Open roadmap step
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-0 xl:self-start">
            <InsetPanel className="p-4" tone="blue">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Resource status
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Update the state here and the library view will respond immediately.
              </p>
              {feedback ? (
                <div
                  aria-live="polite"
                  className="mt-3 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {feedback}
                </div>
              ) : null}
              <div className="mt-4">
                <ResourceStateControls
                  busy={busy}
                  onAction={handleAction}
                  resource={resource}
                />
              </div>
            </InsetPanel>

          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function getFeedbackLabel(action: ResourcePrimaryAction) {
  if (action === "start") {
    return "Resource marked in progress";
  }

  if (action === "complete") {
    return "Resource marked completed";
  }

  if (action === "useful") {
    return "Useful signal saved";
  }

  if (action === "difficult") {
    return "Difficulty signal saved";
  }

  if (action === "review") {
    return "Needs review saved";
  }

  if (action === "skip") {
    return "Skipped for now";
  }

  return "Status reset";
}
