"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, History, PenSquare, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import type { DashboardContentState } from "@/entities/dashboard";
import { useDrafts } from "@/shared/hooks/use-drafts";
import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import { buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  InsetPanel,
  MetricTile,
  QuickActionCard,
  SectionEyebrow,
  SmallTag,
} from "@/shared/ui/surfaces";
import { cn } from "@/shared/lib/utils";

import {
  buildDashboardCollections,
  getFocusBlock,
  pickOutputTask,
} from "@/widgets/dashboard-overview/model/dashboard-overview-selectors";
import {
  formatRelativeTimestamp,
  getLatestEventTimestamp,
  getWritingStatus,
} from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";
import { LearningEventType } from "@/shared/types";

type WritingOverviewProps = {
  content: DashboardContentState;
};

export function WritingOverview({ content }: WritingOverviewProps) {
  const { entries } = useLocalProgress();
  const { drafts, createDraft } = useDrafts();
  const { events } = useLearningEvents(8);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  const collections = buildDashboardCollections(content);
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const focusBlock = getFocusBlock(collections.allBlocks, progressById);
  const nextTask = pickOutputTask(collections.writingTasks, focusBlock?.id);
  const draftForNextTask = nextTask
    ? drafts.find((draft) => draft.taskId === nextTask.id)
    : undefined;
  const recentDrafts = drafts.slice(0, 3);
  const lastWritingAt = getLatestEventTimestamp(
    events,
    LearningEventType.WritingSubmitted,
  );

  const reduced = useReducedMotion();
  const Wrapper = (reduced ? "section" : motion.section) as any;

  async function handleCreateDraft() {
    if (!nextTask) {
      return;
    }

    setDraftNotice(null);

    try {
      await createDraft(nextTask.title, "", nextTask.id);
      setDraftNotice(`Draft started for "${nextTask.title}".`);
    } catch {
      setDraftNotice("Draft creation failed. Try again in a moment.");
    }
  }

  return (
    <Wrapper
      className="space-y-[var(--layout-gap)]"
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.2fr)_20rem]">
        <DashboardCard tone="pink" className="p-6 sm:p-7">
          <SectionEyebrow icon={PenSquare}>Writing studio</SectionEyebrow>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.6rem]">
            {nextTask?.title ?? "Turn study into clear written English."}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {nextTask?.summary ??
              "Use this space to move from roadmap ideas into drafts, revisions, and visible writing momentum."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <SmallTag>{focusBlock?.stageTitle ?? content.templateTitle}</SmallTag>
            {nextTask?.estimatedMinutes ? (
              <SmallTag>{nextTask.estimatedMinutes} min writing</SmallTag>
            ) : null}
            {nextTask?.wordCountMin || nextTask?.wordCountMax ? (
              <SmallTag>{formatWordRange(nextTask.wordCountMin, nextTask.wordCountMax)}</SmallTag>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {nextTask && !draftForNextTask ? (
              <button
                type="button"
                onClick={() => void handleCreateDraft()}
                className={buttonVariants({ size: "lg" })}
              >
                Start draft
              </button>
            ) : (
              <Link href="#draft-stack" className={buttonVariants({ size: "lg" })}>
                Continue draft stack
              </Link>
            )}
            {focusBlock ? (
              <Link
                href={`/roadmap#block-${focusBlock.id}`}
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Open roadmap context
              </Link>
            ) : null}
          </div>

          {draftNotice ? (
            <div className="mt-4 rounded-[1.2rem] border border-state-complete-border bg-surface-state-success px-4 py-3 text-sm text-state-complete-text">
              {draftNotice}
            </div>
          ) : null}
        </DashboardCard>

        <DashboardCard tone="lavender" className="p-5">
          <SectionEyebrow icon={RotateCcw}>Writing rhythm</SectionEyebrow>
          <div className="mt-5 space-y-4">
            <MetricTile
              icon={PenSquare}
              label="Current pace"
              tone="pink"
              value={getWritingStatus(events, drafts.length)}
              detail="A simple view of whether your writing is active, paused, or ready to restart."
            />
            <MetricTile
              icon={History}
              label="Recent return"
              tone="cream"
              value={lastWritingAt ? formatRelativeTimestamp(lastWritingAt) : "Not started"}
              detail="The last time a writing submission was recorded."
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <DashboardCard tone="default" className="p-5 sm:p-6" id="draft-stack">
          <SectionEyebrow icon={History}>Draft stack</SectionEyebrow>
          <div className="mt-5 grid gap-3">
            {recentDrafts.length > 0 ? (
              recentDrafts.map((draft) => (
                <InsetPanel key={draft.id} className="p-4">
                  <p className="text-sm font-semibold text-foreground">{draft.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Updated {formatRelativeTimestamp(draft.updatedAt)}
                  </p>
                </InsetPanel>
              ))
            ) : (
              <InsetPanel tone="cream" className="p-4">
                <p className="text-sm font-semibold text-foreground">No drafts yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start one writing task and your active draft stack will appear here.
                </p>
              </InsetPanel>
            )}
          </div>
        </DashboardCard>

        <div className="space-y-[var(--layout-gap)]">
          <DashboardCard tone="cream" className="p-5">
            <SectionEyebrow icon={AlertCircle}>Feedback and mistakes</SectionEyebrow>
            <div className="mt-5 grid gap-4">
              <QuickActionCard
                icon={AlertCircle}
                eyebrow="Revision lens"
                title="What to tighten next"
                detail={
                  nextTask?.successCriteria ??
                  "Keep one revision target in view so each draft gets clearer, more specific, and easier to read."
                }
                footer="Use one clear improvement target per draft"
                tone="cream"
              >
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Return to daily plan
                </Link>
              </QuickActionCard>
            </div>
          </DashboardCard>

          <DashboardCard tone="blue" className="p-5">
            <SectionEyebrow icon={PenSquare}>Current writing focus</SectionEyebrow>
            <div className="mt-5 space-y-3">
              <InsetPanel tone="blue" className="p-4">
                <p className="text-sm font-semibold text-foreground">
                  {focusBlock?.title ?? "Choose a roadmap block first"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {focusBlock?.summary ??
                    "Your next writing focus will connect to the roadmap once you choose the first active block."}
                </p>
              </InsetPanel>
              {nextTask ? (
                <InsetPanel className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Draft target
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {nextTask.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {nextTask.instructions}
                  </p>
                </InsetPanel>
              ) : null}
            </div>
          </DashboardCard>
        </div>
      </div>
    </Wrapper>
  );
}

function formatWordRange(min: number | null, max: number | null) {
  if (min && max) {
    return `${min}-${max} words`;
  }

  if (min) {
    return `${min}+ words`;
  }

  if (max) {
    return `Up to ${max} words`;
  }

  return "Flexible length";
}
