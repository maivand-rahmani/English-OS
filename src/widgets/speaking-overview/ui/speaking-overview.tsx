"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { History, Lightbulb, MessageCircle, Mic } from "lucide-react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import type { DashboardContentState } from "@/entities/dashboard";
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
  pickOutputPrompt,
} from "@/widgets/dashboard-overview/model/dashboard-overview-selectors";
import {
  formatRelativeTimestamp,
  getLatestEventTimestamp,
  getSpeakingStatus,
} from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";
import { LearningEventType } from "@/shared/types";

type SpeakingOverviewProps = {
  content: DashboardContentState;
};

export function SpeakingOverview({ content }: SpeakingOverviewProps) {
  const { entries } = useLocalProgress();
  const { events } = useLearningEvents(8);

  const collections = buildDashboardCollections(content);
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const focusBlock = getFocusBlock(collections.allBlocks, progressById);
  const nextPrompt = pickOutputPrompt(collections.speakingPrompts, focusBlock?.id);
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );
  const recentSpeakingEvents = events
    .filter((event) => event.type === LearningEventType.SpeakingRecorded)
    .slice(0, 3);

  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;

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
      <DashboardCard tone="blue" className="p-6 sm:p-7">
        <SectionEyebrow icon={Mic}>Speaking studio</SectionEyebrow>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.6rem]">
          {nextPrompt?.title ?? "Keep spoken English active and easy to return to."}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {nextPrompt?.summary ??
            "Use this space to keep prompts, short returns, reflections, and speaking continuity in one calm place."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SmallTag>{focusBlock?.stageTitle ?? content.templateTitle}</SmallTag>
          {nextPrompt?.estimatedMinutes ? (
            <SmallTag>{nextPrompt.estimatedMinutes} min speaking</SmallTag>
          ) : null}
          {nextPrompt?.targetDurationSeconds ? (
            <SmallTag>{Math.round(nextPrompt.targetDurationSeconds / 60)} min target</SmallTag>
          ) : null}
        </div>

        <div className="mobile-stacked-actions mt-8">
          <Link
            href="#speaking-focus"
            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
          >
            Open active prompt
          </Link>
          {focusBlock ? (
            <Link
              href={`/roadmap#block-${focusBlock.id}`}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "sm:w-auto",
              )}
            >
              Open roadmap context
            </Link>
          ) : null}
        </div>
      </DashboardCard>

      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <DashboardCard tone="default" className="p-5 sm:p-6" id="speaking-focus">
          <SectionEyebrow icon={MessageCircle}>Active prompt</SectionEyebrow>
          <div className="mt-5 space-y-4">
            <InsetPanel tone="blue" className="p-4">
              <p className="text-sm font-semibold text-foreground">
                {nextPrompt?.title ?? "Choose a roadmap block to reveal the next prompt"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {nextPrompt?.promptText ??
                  "Your next speaking prompt will connect to the roadmap once the active block is clear."}
              </p>
            </InsetPanel>
            {nextPrompt?.prepHint ? (
              <InsetPanel className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Prep hint
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{nextPrompt.prepHint}</p>
              </InsetPanel>
            ) : null}
            {nextPrompt?.followUpQuestion ? (
              <InsetPanel tone="cream" className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Follow-up
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {nextPrompt.followUpQuestion}
                </p>
              </InsetPanel>
            ) : null}
          </div>
        </DashboardCard>

        <div className="space-y-[var(--layout-gap)]">
          <DashboardCard tone="green" className="p-5">
            <SectionEyebrow icon={History}>Speaking rhythm</SectionEyebrow>
            <div className="mt-5 space-y-4">
              <MetricTile
                icon={Mic}
                label="Current pace"
                tone="blue"
                value={getSpeakingStatus(events)}
                detail="A simple view of whether spoken practice is active, quiet, or ready to restart."
              />
              <MetricTile
                icon={History}
                label="Recent return"
                tone="cream"
                value={lastSpeakingAt ? formatRelativeTimestamp(lastSpeakingAt) : "Not started"}
                detail="The last time a speaking session was recorded."
              />
            </div>
          </DashboardCard>

          <DashboardCard tone="lavender" className="p-5">
            <SectionEyebrow icon={History}>Recent speaking returns</SectionEyebrow>
            <div className="mt-5 grid gap-3">
              {recentSpeakingEvents.length > 0 ? (
                recentSpeakingEvents.map((event) => (
                  <InsetPanel key={event.id} className="p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Speaking return
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {Math.round(event.payload.durationSeconds / 60)} min recorded{" "}
                      {formatRelativeTimestamp(event.timestamp)}
                    </p>
                  </InsetPanel>
                ))
              ) : (
                <InsetPanel tone="lavender" className="p-4">
                  <p className="text-sm font-semibold text-foreground">No speaking returns yet</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your recent speaking activity will start collecting here after the
                    first recorded session.
                  </p>
                </InsetPanel>
              )}
            </div>
          </DashboardCard>

          <DashboardCard tone="cream" className="p-5">
            <SectionEyebrow icon={Lightbulb}>Warm-up and reflection</SectionEyebrow>
            <QuickActionCard
              icon={Lightbulb}
              eyebrow="Speaking flow"
              title="Keep the session simple"
              detail="Think for a moment, answer once clearly, then add one short follow-up thought instead of chasing a perfect performance."
              footer="Short, repeatable speaking returns beat long rare sessions"
              tone="cream"
            >
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Return to daily plan
              </Link>
            </QuickActionCard>
          </DashboardCard>
        </div>
      </div>
    </Wrapper>
  );
}
