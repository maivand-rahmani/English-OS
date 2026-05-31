"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  History,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Mic,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import type { DashboardContentState } from "@/entities/dashboard";
import {
  getWorkspaceItemMotion,
  getWorkspaceRevealMotion,
  getWorkspaceShellMotion,
  getWorkspaceSwapMotion,
} from "@/shared/lib/workspace-motion";
import { LearningEventType, type SpeakingRecordedEvent } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  InfoTile,
  InsetPanel,
  MetricTile,
  QuickActionCard,
  SectionEyebrow,
  SmallTag,
} from "@/shared/ui/surfaces";
import {
  formatRelativeTimestamp,
  getLatestEventTimestamp,
  getSpeakingStatus,
} from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";

import {
  formatSpeakingDuration,
  getTranscriptPreview,
  getTranscriptSummary,
} from "../model/speaking-session-helpers";
import { getSpeakingHistorySnapshot } from "../model/speaking-history";
import { useSpeakingWorkspace } from "../model/use-speaking-workspace";

type SpeakingOverviewProps = {
  content: DashboardContentState;
};

export function SpeakingOverview({ content }: SpeakingOverviewProps) {
  const workspace = useSpeakingWorkspace(content);
  const focusBlock = workspace.focusBlock;
  const activePrompt = workspace.activePrompt;
  const activeSession = workspace.activeSession;
  const activePromptListItem = workspace.prompts.find(
    (prompt) => prompt.id === activePrompt?.id,
  );
  const lastSpeakingAt = getLatestEventTimestamp(
    workspace.events,
    LearningEventType.SpeakingRecorded,
  );
  const speakingEvents = workspace.events.filter(
    (event): event is SpeakingRecordedEvent =>
      event.type === LearningEventType.SpeakingRecorded,
  );
  const latestTranscriptEvent = speakingEvents.find((event) =>
    Boolean(event.payload.transcript?.trim()),
  );
  const promptTitleById = new Map(
    workspace.prompts.map((prompt) => [prompt.id, prompt.title]),
  );
  const activeRoadmapBlockId = activePrompt?.blockId ?? focusBlock?.id;
  const sessionSummary = workspace.sessionSummary;
  const transcriptSource =
    activeSession?.status === "reflecting"
      ? workspace.transcriptDraft
      : latestTranscriptEvent?.payload.transcript ?? "";
  const transcriptStatus = getTranscriptSummary(transcriptSource);
  const transcriptPreview =
    transcriptSource.trim() ? getTranscriptPreview(transcriptSource) : null;
  const speakingHistory = getSpeakingHistorySnapshot(
    workspace.events,
    promptTitleById,
    workspace.reflectionOptions,
  );

  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;

  return (
    <Wrapper
      className="space-y-[var(--layout-gap)]"
      {...getWorkspaceShellMotion(reduced)}
    >
      <motion.div {...getWorkspaceRevealMotion(reduced, 0)}>
        <DashboardCard tone="blue" className="p-6 sm:p-7">
          <SectionEyebrow icon={Mic}>Speaking studio</SectionEyebrow>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.6rem]">
            {activePrompt?.title ?? "Keep spoken English active and easy to return to."}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {activePrompt?.summary ??
              "Use this space to keep prompts, short returns, reflections, and speaking continuity in one calm place."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <SmallTag>
              {activePrompt?.stageTitle ?? focusBlock?.stageTitle ?? content.templateTitle}
            </SmallTag>
            {activePrompt?.blockTitle ? <SmallTag>{activePrompt.blockTitle}</SmallTag> : null}
            {activePrompt?.estimatedMinutes ? (
              <SmallTag>{activePrompt.estimatedMinutes} min speaking</SmallTag>
            ) : null}
            {activePrompt?.targetDurationSeconds ? (
              <SmallTag>{formatTargetDuration(activePrompt.targetDurationSeconds)}</SmallTag>
            ) : null}
            {activeSession ? (
              <SmallTag>{sessionSummary.label}</SmallTag>
            ) : activePromptListItem?.lastRecordedAt ? (
              <SmallTag>
                Last return {formatRelativeTimestamp(activePromptListItem.lastRecordedAt)}
              </SmallTag>
            ) : null}
          </div>

          <div className="mobile-stacked-actions mt-8">
            {activeSession ? (
              <Link
                href={activeSession.status === "reflecting" ? "#session-reflection" : "#speaking-focus"}
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                {activeSession.status === "reflecting"
                  ? "Finish reflection"
                  : "Continue session"}
              </Link>
            ) : activePrompt ? (
              <button
                type="button"
                onClick={() => workspace.handleStartSession()}
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                Start speaking session
              </button>
            ) : (
              <Link
                href="#prompt-list"
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                Open prompt list
              </Link>
            )}
            {activeRoadmapBlockId ? (
              <Link
                href={`/roadmap#block-${activeRoadmapBlockId}`}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "sm:w-auto",
                )}
              >
                Open roadmap context
              </Link>
            ) : null}
          </div>

          {workspace.notice ? (
            <div className="mt-4 rounded-[1.2rem] border border-state-complete-border bg-surface-state-success px-4 py-3 text-sm text-state-complete-text">
              {workspace.notice}
            </div>
          ) : null}

          {workspace.workspaceError ? (
            <div className="mt-4 rounded-[1.2rem] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {workspace.workspaceError}
            </div>
          ) : null}
        </DashboardCard>
      </motion.div>

      <motion.div
        className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        {...getWorkspaceRevealMotion(reduced, 1)}
      >
        <DashboardCard tone="default" className="p-5 sm:p-6" id="speaking-focus">
          <SectionEyebrow icon={MessageCircle}>Active prompt</SectionEyebrow>
          <div className="mt-5 space-y-5">
            <div className="flex flex-wrap gap-2">
              <SmallTag>
                {activePrompt?.stageTitle ?? focusBlock?.stageTitle ?? content.templateTitle}
              </SmallTag>
              {activePrompt?.blockTitle ? <SmallTag>{activePrompt.blockTitle}</SmallTag> : null}
              {activePrompt?.estimatedMinutes ? (
                <SmallTag>{activePrompt.estimatedMinutes} min</SmallTag>
              ) : null}
              {activePrompt?.targetDurationSeconds ? (
                <SmallTag>{formatTargetDuration(activePrompt.targetDurationSeconds)}</SmallTag>
              ) : null}
            </div>

            {activePrompt ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoTile
                    label="Session state"
                    value={sessionSummary.label}
                    tone="blue"
                    detail={sessionSummary.detail}
                  />
                  <InfoTile
                    label="Live timer"
                    value={formatSpeakingDuration(workspace.elapsedSeconds)}
                    tone="lavender"
                    detail="This local timer keeps the speaking return resumable across short interruptions."
                  />
                  <InfoTile
                    label="Reflection"
                    value={workspace.reflectionLabel ?? "Waiting"}
                    tone="cream"
                    detail={
                      activeSession?.status === "reflecting"
                        ? "Pick one note before saving the session."
                        : "Choose one quick reflection after you finish speaking."
                    }
                  />
                  <InfoTile
                    label="Transcript"
                    value={transcriptStatus.label}
                    tone="default"
                    detail={
                      transcriptStatus.wordCount > 0
                        ? `${transcriptStatus.wordCount} words captured locally.`
                        : transcriptStatus.detail
                    }
                  />
                </div>

                <InsetPanel tone="blue" className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Prompt
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {activePrompt.promptText}
                  </p>
                </InsetPanel>

                <InsetPanel className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Local session flow
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    Speak out loud while this local session runs. The timer and reflection
                    save in the browser now, and the transcript draft gives future
                    speaking review a clean starting point.
                  </p>
                </InsetPanel>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                  {activePrompt.prepHint ? (
                    <InsetPanel className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Prep hint
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {activePrompt.prepHint}
                      </p>
                    </InsetPanel>
                  ) : null}
                  {activePrompt.followUpQuestion ? (
                    <InsetPanel tone="cream" className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Reflection question
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {activePrompt.followUpQuestion}
                      </p>
                    </InsetPanel>
                  ) : null}
                </div>

                <AnimatePresence initial={false} mode="wait">
                  {!activeSession ? (
                    <motion.div
                      key="speaking-session-idle"
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <InsetPanel tone="cream" className="p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Ready for a speaking return
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Start the session when you are ready, speak through the prompt once,
                          then save one quick reflection before leaving the workspace.
                        </p>
                        <div className="mobile-stacked-actions mt-4">
                          <button
                            type="button"
                            onClick={() => workspace.handleStartSession()}
                            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
                          >
                            Start speaking session
                          </button>
                        </div>
                      </InsetPanel>
                    </motion.div>
                  ) : activeSession.status === "reflecting" ? (
                    <motion.div
                      key="speaking-session-reflecting"
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <InsetPanel tone="lavender" className="p-4" id="session-reflection">
                        <p className="text-sm font-semibold text-foreground">
                          Reflection before save
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Keep this light. One signal is enough to make the next speaking
                          session easier to continue.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {workspace.reflectionOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => workspace.handleChooseReflection(option.value)}
                              className={cn(
                                "rounded-full border px-3 py-2 text-left text-sm transition-all duration-200 ease-out",
                                activeSession.reflection === option.value
                                  ? "border-surface-dark-control bg-surface-dark-control text-primary-foreground shadow-control"
                                  : "border-surface-stroke-strong bg-surface-panel text-foreground hover:bg-surface-panel-strong",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {workspace.reflectionLabel ? (
                          <p className="mt-4 text-sm leading-6 text-muted-foreground">
                            {workspace.reflectionOptions.find(
                              (option) => option.value === activeSession.reflection,
                            )?.detail ?? "Reflection saved locally."}
                          </p>
                        ) : null}
                        <div className="mt-5">
                          <label
                            htmlFor="speaking-transcript-draft"
                            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            Transcript draft
                          </label>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Add a rough transcript of what you said. It does not need to be perfect.
                            This is the handoff point for future transcript-based feedback.
                          </p>
                          <textarea
                            id="speaking-transcript-draft"
                            value={workspace.transcriptDraft}
                            onChange={(event) =>
                              workspace.handleTranscriptChange(event.target.value)
                            }
                            placeholder="Type or paste a rough transcript of your answer here."
                            className="mt-3 min-h-[10rem] w-full rounded-[1.55rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke focus:ring-2 focus:ring-surface-module-lavender/50"
                          />
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {workspace.transcriptSummary.detail}
                          </p>
                        </div>
                        <div className="mobile-stacked-actions mt-5">
                          <button
                            type="button"
                            onClick={() => void workspace.handleSaveSession()}
                            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
                          >
                            Save speaking session
                          </button>
                          <button
                            type="button"
                            onClick={() => workspace.handleClearSession()}
                            className={cn(
                              buttonVariants({ size: "lg", variant: "outline" }),
                              "sm:w-auto",
                            )}
                          >
                            Clear session
                          </button>
                        </div>
                      </InsetPanel>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`speaking-session-${activeSession.status}`}
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <InsetPanel tone="green" className="p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Session in progress
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Keep speaking with simple English. Pause if you need to think, then
                          finish once the answer feels complete enough.
                        </p>
                        <div className="mobile-stacked-actions mt-5">
                          {activeSession.status === "active" ? (
                            <button
                              type="button"
                              onClick={() => workspace.handlePauseSession()}
                              className={cn(
                                buttonVariants({ size: "lg", variant: "outline" }),
                                "sm:w-auto",
                              )}
                            >
                              Pause session
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => workspace.handleResumeSession()}
                              className={cn(
                                buttonVariants({ size: "lg", variant: "outline" }),
                                "sm:w-auto",
                              )}
                            >
                              Resume session
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => workspace.handleFinishSession()}
                            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
                          >
                            Finish session
                          </button>
                          <button
                            type="button"
                            onClick={() => workspace.handleClearSession()}
                            className={cn(
                              buttonVariants({ size: "lg", variant: "ghost" }),
                              "sm:w-auto",
                            )}
                          >
                            Clear session
                          </button>
                        </div>
                      </InsetPanel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <InsetPanel tone="cream" className="p-4">
                <p className="text-sm font-semibold text-foreground">
                  Choose a speaking prompt first
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The active prompt workspace will appear here once you select one
                  from the prompt list below.
                </p>
              </InsetPanel>
            )}
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
                value={getSpeakingStatus(workspace.events)}
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

          <DashboardCard tone="lavender" className="p-5" id="recent-speaking">
            <SectionEyebrow icon={History}>Local practice history</SectionEyebrow>
            <div className="mt-5 space-y-4">
              <InsetPanel tone="lavender" className="p-4">
                <p className="text-sm font-semibold text-foreground">
                  {speakingHistory.headline}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {speakingHistory.detail}
                </p>
              </InsetPanel>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile
                  label="This week"
                  value={`${speakingHistory.stats.sessionsThisWeek} return${speakingHistory.stats.sessionsThisWeek === 1 ? "" : "s"}`}
                  tone="blue"
                  detail="Based on local speaking events stored in this browser."
                />
                <InfoTile
                  label="Transcript ready"
                  value={`${speakingHistory.stats.transcriptReadyCount} saved`}
                  tone="lavender"
                  detail={
                    speakingHistory.stats.transcriptReadyCount > 0
                      ? "Transcript drafts are staying connected to saved speaking returns."
                      : "Save one transcript to unlock a stronger review trail."
                  }
                />
                <InfoTile
                  label="Speaking time"
                  value={formatSpeakingDuration(speakingHistory.stats.totalDurationSeconds)}
                  tone="cream"
                  detail={
                    speakingHistory.stats.latestReflectionLabel
                      ? `Latest signal: ${speakingHistory.stats.latestReflectionLabel}.`
                      : speakingHistory.stats.repeatedPromptCount > 0
                        ? `${speakingHistory.stats.repeatedPromptCount} prompt${speakingHistory.stats.repeatedPromptCount === 1 ? "" : "s"} repeated so far.`
                        : "Short saved returns build visible speaking continuity."
                  }
                />
              </div>

              <div className="grid gap-3">
                {speakingHistory.entries.length > 0 ? (
                  speakingHistory.entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      {...getWorkspaceItemMotion(reduced, index)}
                    >
                      <InsetPanel
                        tone={
                          entry.hasTranscript
                            ? "blue"
                            : entry.reflectionLabel
                              ? "lavender"
                              : "default"
                        }
                        className="p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {entry.promptTitle}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {formatSpeakingDuration(entry.durationSeconds)} recorded{" "}
                              {formatRelativeTimestamp(entry.timestamp)}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {entry.summary}
                            </p>
                          </div>
                          <SmallTag>
                            {entry.hasTranscript
                              ? "Transcript ready"
                              : entry.reflectionLabel ?? "Saved return"}
                          </SmallTag>
                        </div>
                        {entry.promptId ? (
                          <div className="mobile-stacked-actions mt-4">
                            <Link
                              href="#speaking-focus"
                              onClick={() => workspace.handleSelectPrompt(entry.promptId!)}
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                                "w-full",
                              )}
                            >
                              Repeat prompt
                            </Link>
                          </div>
                        ) : null}
                      </InsetPanel>
                    </motion.div>
                  ))
                ) : (
                  <InsetPanel tone="lavender" className="p-4">
                    <p className="text-sm font-semibold text-foreground">
                      No speaking returns yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Record the first speaking session to start building visible continuity
                      in this browser.
                    </p>
                  </InsetPanel>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard tone="blue" className="p-5">
            <SectionEyebrow icon={FileText}>Transcript view</SectionEyebrow>
            <div className="mt-5 space-y-4">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={
                    activeSession?.status === "reflecting"
                      ? "speaking-transcript-draft"
                      : transcriptPreview
                        ? "speaking-transcript-saved"
                        : "speaking-transcript-empty"
                  }
                  {...getWorkspaceSwapMotion(reduced)}
                >
                  <InsetPanel tone="blue" className="p-4">
                    <p className="text-sm font-semibold text-foreground">
                      {activeSession?.status === "reflecting"
                        ? "Current transcript draft"
                        : "Latest transcript view"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activeSession?.status === "reflecting"
                        ? workspace.transcriptSummary.detail
                        : transcriptPreview
                          ? "The latest saved speaking return already has a transcript surface for future review."
                          : "Save one speaking return with a rough transcript to unlock this transcript surface."}
                    </p>
                    {transcriptPreview ? (
                      <p className="mt-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel px-4 py-3 text-sm leading-7 text-foreground">
                        {transcriptPreview}
                      </p>
                    ) : null}
                  </InsetPanel>
                </motion.div>
              </AnimatePresence>
            </div>
          </DashboardCard>

          <DashboardCard tone="cream" className="p-5">
            <SectionEyebrow icon={Lightbulb}>Warm-up and reflection</SectionEyebrow>
            <QuickActionCard
              icon={activeSession ? AlertCircle : Lightbulb}
              eyebrow="Speaking flow"
              title={
                activeSession?.status === "reflecting"
                  ? "Save the reflection while the session is still fresh"
                  : activePrompt?.followUpQuestion ?? "Keep the session simple"
              }
              detail={
                activeSession?.status === "reflecting"
                  ? "Choose one signal, save the session, and let the next prompt stay approachable."
                  : activePrompt?.prepHint ??
                    "Think for a moment, answer once clearly, then add one short follow-up thought instead of chasing a perfect performance."
              }
              footer="Short, repeatable speaking returns beat long rare sessions"
              tone="cream"
            >
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="#prompt-list"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Review prompt list
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                >
                  Return to daily plan
                </Link>
              </div>
            </QuickActionCard>
          </DashboardCard>
        </div>
      </motion.div>

      <motion.div {...getWorkspaceRevealMotion(reduced, 2)}>
        <DashboardCard tone="default" className="p-5 sm:p-6" id="prompt-list">
          <SectionEyebrow icon={ListChecks}>Speaking prompt list</SectionEyebrow>
          <div className="mt-5 grid gap-3">
            {workspace.prompts.length > 0 ? (
              workspace.prompts.map((prompt) => (
                <InsetPanel
                  key={prompt.id}
                  tone={prompt.isActive ? "blue" : prompt.lastRecordedAt ? "lavender" : "default"}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <SmallTag>{prompt.stageTitle}</SmallTag>
                        <SmallTag>{prompt.blockTitle}</SmallTag>
                        {prompt.lastRecordedAt ? (
                          <SmallTag>
                            Returned {formatRelativeTimestamp(prompt.lastRecordedAt)}
                          </SmallTag>
                        ) : null}
                        {!prompt.lastRecordedAt && prompt.isRecommended ? (
                          <SmallTag>Recommended now</SmallTag>
                        ) : null}
                      </div>
                      <p className="mt-3 text-lg font-semibold text-foreground">
                        {prompt.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {prompt.summary ?? prompt.promptText}
                      </p>
                    </div>
                    {prompt.isActive ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-surface-dark-control px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                        <CheckCircle2 className="size-3.5" />
                        In focus
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.estimatedMinutes ? (
                      <SmallTag>{prompt.estimatedMinutes} min</SmallTag>
                    ) : null}
                    {prompt.targetDurationSeconds ? (
                      <SmallTag>{formatTargetDuration(prompt.targetDurationSeconds)}</SmallTag>
                    ) : null}
                  </div>

                  {prompt.isActive ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                      <InsetPanel tone="blue" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Prompt
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {prompt.promptText}
                        </p>
                      </InsetPanel>
                      <div className="grid gap-3">
                        {prompt.prepHint ? (
                          <InsetPanel className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              Prep hint
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground">
                              {prompt.prepHint}
                            </p>
                          </InsetPanel>
                        ) : null}
                        {prompt.followUpQuestion ? (
                          <InsetPanel tone="cream" className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              Reflection question
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground">
                              {prompt.followUpQuestion}
                            </p>
                          </InsetPanel>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="mobile-stacked-actions mt-5">
                    {prompt.isActive ? (
                      activeSession ? (
                        <Link
                          href={activeSession.status === "reflecting" ? "#session-reflection" : "#speaking-focus"}
                          className={cn(buttonVariants(), "sm:w-auto")}
                        >
                          {activeSession.status === "reflecting"
                            ? "Resume reflection"
                            : "Continue session"}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => workspace.handleStartSession()}
                          className={cn(buttonVariants(), "sm:w-auto")}
                        >
                          Start session
                        </button>
                      )
                    ) : (
                      <Link
                        href="#speaking-focus"
                        onClick={() => workspace.handleSelectPrompt(prompt.id)}
                        className={cn(buttonVariants(), "sm:w-auto")}
                      >
                        Focus prompt
                      </Link>
                    )}

                    {!prompt.isActive ? (
                      <button
                        type="button"
                        onClick={() => workspace.handleSelectPrompt(prompt.id)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "sm:w-auto",
                        )}
                      >
                        Preview prompt
                      </button>
                    ) : null}
                  </div>
                </InsetPanel>
              ))
            ) : (
              <InsetPanel tone="cream" className="p-4">
                <p className="text-sm font-semibold text-foreground">
                  No speaking prompts yet
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Seeded speaking prompts will appear here once the current roadmap
                  blocks include output practice.
                </p>
              </InsetPanel>
            )}
          </div>
        </DashboardCard>
      </motion.div>
    </Wrapper>
  );
}

function formatTargetDuration(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) {
    return "Flexible target";
  }

  if (seconds < 60) {
    return `${seconds} sec target`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min target`;
  }

  return `${minutes} min ${remainingSeconds}s target`;
}
