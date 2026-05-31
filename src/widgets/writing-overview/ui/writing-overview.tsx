"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  History,
  LoaderCircle,
  ListChecks,
  PenSquare,
  RotateCcw,
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
import { cn } from "@/shared/lib/utils";

import {
  formatRelativeTimestamp,
  getLatestEventTimestamp,
  getWritingStatus,
} from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";
import {
  getSubmissionSummary,
  getWordTargetGuidance,
  hasRevisionSinceSubmit,
} from "../model/writing-draft-helpers";
import { getWritingFeedbackPreview } from "../model/writing-feedback-preview";
import { getWritingHistorySnapshot } from "../model/writing-history";
import { useWritingWorkspace } from "../model/use-writing-workspace";

type WritingOverviewProps = {
  content: DashboardContentState;
};

export function WritingOverview({ content }: WritingOverviewProps) {
  const workspace = useWritingWorkspace(content);
  const focusBlock = workspace.focusBlock;
  const activeTask = workspace.activeTask;
  const activeDraft = workspace.activeDraft;
  const drafts = workspace.drafts;
  const recentDrafts = drafts.slice(0, 3);
  const lastWritingAt = getLatestEventTimestamp(
    workspace.events,
    "writing_submitted",
  );
  const activeRoadmapBlockId = activeTask?.blockId ?? focusBlock?.id;
  const revisionInProgress = hasRevisionSinceSubmit(activeDraft ?? undefined);
  const submissionSummary = activeDraft
    ? getSubmissionSummary(activeDraft)
    : {
        detail: "Open one task and start drafting to make the feedback loop real.",
        label: "No active submission yet",
      };
  const feedbackPreview = getWritingFeedbackPreview({
    content: workspace.editorContent,
    draft: activeDraft,
    task: activeTask,
    wordCount: workspace.wordCount,
  });
  const wordGuidance = getWordTargetGuidance(
    workspace.wordCount,
    activeTask?.wordCountMin,
    activeTask?.wordCountMax,
  );
  const writingHistory = getWritingHistorySnapshot(drafts, workspace.events);

  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;

  return (
    <Wrapper
      className="space-y-[var(--layout-gap)]"
      {...getWorkspaceShellMotion(reduced)}
    >
      <motion.div
        className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.2fr)_20rem]"
        {...getWorkspaceRevealMotion(reduced, 0)}
      >
        <DashboardCard tone="pink" className="p-6 sm:p-7">
          <SectionEyebrow icon={PenSquare}>Writing studio</SectionEyebrow>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.6rem]">
            {activeTask?.title ?? "Turn study into clear written English."}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {activeTask?.summary ??
              "Use this space to move from roadmap ideas into drafts, revisions, and visible writing momentum."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <SmallTag>{activeTask?.stageTitle ?? focusBlock?.stageTitle ?? content.templateTitle}</SmallTag>
            {activeTask?.blockTitle ? <SmallTag>{activeTask.blockTitle}</SmallTag> : null}
            {activeTask?.estimatedMinutes ? (
              <SmallTag>{activeTask.estimatedMinutes} min writing</SmallTag>
            ) : null}
            {activeTask?.wordCountMin || activeTask?.wordCountMax ? (
              <SmallTag>
                {formatWordRange(activeTask.wordCountMin, activeTask.wordCountMax)}
              </SmallTag>
            ) : null}
            {activeDraft ? <SmallTag>Local draft ready</SmallTag> : null}
            {feedbackPreview ? (
              <SmallTag>{revisionInProgress ? "Revision in progress" : "Feedback ready"}</SmallTag>
            ) : null}
          </div>

          <div className="mobile-stacked-actions mt-8">
            {activeTask && !activeDraft ? (
              <button
                type="button"
                onClick={() => void workspace.handleCreateDraft(activeTask)}
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                Start draft
              </button>
            ) : (
              <Link
                href={
                  feedbackPreview && !revisionInProgress
                    ? "#feedback-view"
                    : activeDraft
                      ? "#draft-workspace"
                      : "#task-list"
                }
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                {feedbackPreview && !revisionInProgress
                  ? "Review feedback"
                  : activeDraft
                    ? "Continue current draft"
                    : "Continue task list"}
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

        <DashboardCard tone="lavender" className="p-5">
          <SectionEyebrow icon={RotateCcw}>Writing rhythm</SectionEyebrow>
          <div className="mt-5 space-y-4">
            <MetricTile
              icon={PenSquare}
              label="Current pace"
              tone="pink"
              value={getWritingStatus(workspace.events, drafts.length)}
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
      </motion.div>

      <motion.div
        className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        {...getWorkspaceRevealMotion(reduced, 1)}
      >
        <DashboardCard tone="default" className="p-5 sm:p-6" id="draft-workspace">
          <SectionEyebrow icon={FileText}>Active draft</SectionEyebrow>
          <div className="mt-5 space-y-5">
            <div className="flex flex-wrap gap-2">
              <SmallTag>{activeTask?.stageTitle ?? focusBlock?.stageTitle ?? content.templateTitle}</SmallTag>
              {activeTask?.blockTitle ? <SmallTag>{activeTask.blockTitle}</SmallTag> : null}
              {activeTask?.estimatedMinutes ? (
                <SmallTag>{activeTask.estimatedMinutes} min</SmallTag>
              ) : null}
              {activeTask?.wordCountMin || activeTask?.wordCountMax ? (
                <SmallTag>
                  {formatWordRange(activeTask?.wordCountMin ?? null, activeTask?.wordCountMax ?? null)}
                </SmallTag>
              ) : null}
            </div>

            {activeTask ? (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoTile
                    label="Word count"
                    value={`${workspace.wordCount} words`}
                    tone="pink"
                    detail={wordGuidance}
                  />
                  <InfoTile
                    label="Local save"
                    value={formatSaveState(workspace.saveState)}
                    tone="lavender"
                    detail={
                      workspace.saveState === "dirty"
                        ? "Changes will save locally in a moment."
                        : "Draft changes stay client-first for quick return sessions."
                    }
                  />
                  <InfoTile
                    label="Submission"
                    value={submissionSummary.label}
                    tone="cream"
                    detail={submissionSummary.detail}
                  />
                </div>

                <AnimatePresence initial={false} mode="wait">
                  {workspace.isLoadingDraft ? (
                    <motion.div
                      key="writing-draft-loading"
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <InsetPanel className="flex items-center gap-3 p-4">
                        <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Opening the local draft workspace...
                        </p>
                      </InsetPanel>
                    </motion.div>
                  ) : activeDraft ? (
                    <motion.div
                      key={`writing-draft-${activeDraft.id}`}
                      className="space-y-5"
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_18rem]">
                        <InsetPanel className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Assignment
                          </p>
                          <p className="mt-2 text-sm leading-6 text-foreground">
                            {activeTask.instructions}
                          </p>
                        </InsetPanel>
                        <InsetPanel tone="cream" className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Success target
                          </p>
                          <p className="mt-2 text-sm leading-6 text-foreground">
                            {activeTask.successCriteria ??
                              "Keep the response clear, personal, and easy to revise after the first pass."}
                          </p>
                        </InsetPanel>
                      </div>

                      <div>
                        <label
                          htmlFor="writing-draft-editor"
                          className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                          Draft editor
                        </label>
                        <textarea
                          id="writing-draft-editor"
                          value={workspace.editorContent}
                          onChange={(event) =>
                            workspace.handleEditorChange(event.target.value)
                          }
                          placeholder="Write your response here. Keep it simple first, then revise."
                          className="mt-3 min-h-[19rem] w-full rounded-[1.55rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke focus:ring-2 focus:ring-surface-module-lavender/50"
                        />
                      </div>

                      <div className="mobile-stacked-actions">
                        <button
                          type="button"
                          onClick={() => void workspace.handleSaveNow()}
                          className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "sm:w-auto",
                          )}
                        >
                          Save locally
                        </button>
                        <button
                          type="button"
                          onClick={() => void workspace.handleSubmitDraft()}
                          className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
                          disabled={workspace.saveState === "submitting"}
                        >
                          Submit attempt
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="writing-draft-empty"
                      {...getWorkspaceSwapMotion(reduced)}
                    >
                      <InsetPanel tone="cream" className="p-4">
                        <p className="text-sm font-semibold text-foreground">
                          No local draft yet
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Start this task to open a local draft surface that saves in the
                          browser and can be submitted into the writing loop.
                        </p>
                        <div className="mobile-stacked-actions mt-4">
                          <button
                            type="button"
                            onClick={() => void workspace.handleCreateDraft(activeTask)}
                            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
                          >
                            Start draft
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
                  Choose a writing task first
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The draft editor will appear here once a task is selected from the
                  workspace list below.
                </p>
              </InsetPanel>
            )}
          </div>
        </DashboardCard>

        <div className="space-y-[var(--layout-gap)]">
          <DashboardCard tone="cream" className="p-5" id="feedback-view">
            <SectionEyebrow icon={AlertCircle}>Feedback view</SectionEyebrow>
            <div className="mt-5 space-y-4">
              <QuickActionCard
                icon={feedbackPreview ? (revisionInProgress ? RotateCcw : CheckCircle2) : AlertCircle}
                eyebrow="Structured review slot"
                title={feedbackPreview?.statusLabel ?? submissionSummary.label}
                detail={feedbackPreview?.overallSummary ?? submissionSummary.detail}
                footer={
                  feedbackPreview
                    ? revisionInProgress
                      ? "Use these notes to tighten the revision, then submit again."
                      : "This local layout is ready for future AI feedback without changing the workspace flow."
                    : "Finish one attempt and submit it to unlock structured notes, rewrite prompts, and pattern visibility."
                }
                tone="cream"
              >
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="#draft-workspace"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    Return to active draft
                  </Link>
                  {feedbackPreview && revisionInProgress ? (
                    <button
                      type="button"
                      onClick={() => void workspace.handleSubmitDraft()}
                      className={cn(buttonVariants(), "w-full")}
                      disabled={workspace.saveState === "submitting"}
                    >
                      Resubmit revised draft
                    </button>
                  ) : null}
                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                  >
                    Back to daily plan
                  </Link>
                </div>
              </QuickActionCard>

              <AnimatePresence initial={false} mode="wait">
                {feedbackPreview ? (
                  <motion.div
                    key={`writing-feedback-${feedbackPreview.statusLabel}-${revisionInProgress ? "revising" : "ready"}`}
                    className="space-y-4"
                    {...getWorkspaceSwapMotion(reduced)}
                  >
                    <div className="grid gap-3">
                      {feedbackPreview.keyIssues.map((issue) => (
                        <InsetPanel key={issue.title} className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {issue.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-foreground">
                            {issue.detail}
                          </p>
                        </InsetPanel>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InsetPanel className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Grammar notes
                        </p>
                        <div className="mt-3 space-y-2">
                          {feedbackPreview.grammarNotes.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>

                      <InsetPanel tone="lavender" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Naturalness suggestions
                        </p>
                        <div className="mt-3 space-y-2">
                          {feedbackPreview.naturalnessSuggestions.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>

                      <InsetPanel tone="blue" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Vocabulary suggestions
                        </p>
                        <div className="mt-3 space-y-2">
                          {feedbackPreview.vocabularySuggestions.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>

                      <InsetPanel tone="default" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Pattern notes
                        </p>
                        <div className="mt-3 space-y-3">
                          {feedbackPreview.detectedPatterns.map((pattern) => (
                            <div key={pattern.label}>
                              <SmallTag>{pattern.label}</SmallTag>
                              <p className="mt-2 text-sm leading-6 text-foreground">
                                {pattern.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </InsetPanel>
                    </div>

                    <InsetPanel tone="green" className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Next practice focus
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {feedbackPreview.nextPracticeFocus}
                      </p>
                    </InsetPanel>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                      <InsetPanel tone="pink" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Rewrite loop
                        </p>
                        <div className="mt-3 space-y-3">
                          {feedbackPreview.revisionChecklist.map((step, index) => (
                            <div key={step} className="flex items-start gap-3">
                              <div className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-dark-control text-[11px] font-semibold text-primary-foreground">
                                {index + 1}
                              </div>
                              <p className="text-sm leading-6 text-foreground">{step}</p>
                            </div>
                          ))}
                        </div>
                      </InsetPanel>

                      <InsetPanel className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Correction slot
                        </p>
                        {feedbackPreview.correctedVersion ? (
                          <>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              Local rewrite starter. Future AI correction can replace this without changing the layout.
                            </p>
                            <p className="mt-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel px-4 py-3 text-sm leading-7 text-foreground">
                              {feedbackPreview.correctedVersion}
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            This slot is ready for a corrected version later. For now, use the notes and rewrite steps above to improve the draft manually.
                          </p>
                        )}
                      </InsetPanel>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </DashboardCard>

          <DashboardCard tone="blue" className="p-5" id="writing-history">
            <SectionEyebrow icon={History}>Local practice history</SectionEyebrow>
            <div className="mt-5 space-y-4">
              <InsetPanel tone="blue" className="p-4">
                <p className="text-sm font-semibold text-foreground">
                  {writingHistory.headline}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {writingHistory.detail}
                </p>
              </InsetPanel>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile
                  label="This week"
                  value={`${writingHistory.stats.submissionsThisWeek} submission${writingHistory.stats.submissionsThisWeek === 1 ? "" : "s"}`}
                  tone="pink"
                  detail="Based on local writing events stored in this browser."
                />
                <InfoTile
                  label="Drafts in motion"
                  value={`${writingHistory.stats.draftsInProgress} draft${writingHistory.stats.draftsInProgress === 1 ? "" : "s"}`}
                  tone="lavender"
                  detail={
                    writingHistory.stats.revisionsInProgress > 0
                      ? `${writingHistory.stats.revisionsInProgress} revision loop${writingHistory.stats.revisionsInProgress === 1 ? "" : "s"} still open.`
                      : "Draft continuity stays local-first for quick return sessions."
                  }
                />
                <InfoTile
                  label="Latest attempt"
                  value={
                    writingHistory.latestWordCount != null
                      ? `${writingHistory.latestWordCount} words`
                      : "Not submitted"
                  }
                  tone="cream"
                  detail={
                    writingHistory.latestSubmittedAt
                      ? `Last submitted ${formatRelativeTimestamp(writingHistory.latestSubmittedAt)}`
                      : "Submit one attempt to turn draft work into visible history."
                  }
                />
              </div>

              <div className="grid gap-3">
                {writingHistory.entries.length > 0 ? (
                  writingHistory.entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      {...getWorkspaceItemMotion(reduced, index)}
                    >
                      <InsetPanel
                        tone={
                          entry.revisionPending
                            ? "lavender"
                            : entry.lastSubmittedAt
                              ? "default"
                              : "cream"
                        }
                        className="p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {entry.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {entry.summary}
                            </p>
                          </div>
                          <SmallTag>{entry.statusLabel}</SmallTag>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {entry.lastSubmittedAt
                            ? `Touched ${formatRelativeTimestamp(entry.timestamp)}`
                            : `Updated ${formatRelativeTimestamp(entry.timestamp)}`}
                        </p>
                        {entry.taskId ? (
                          <div className="mobile-stacked-actions mt-4">
                            <Link
                              href="#draft-workspace"
                              onClick={() => workspace.handleSelectTask(entry.taskId!)}
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                                "w-full",
                              )}
                            >
                              Reopen draft
                            </Link>
                          </div>
                        ) : null}
                      </InsetPanel>
                    </motion.div>
                  ))
                ) : (
                  <InsetPanel tone="cream" className="p-4">
                    <p className="text-sm font-semibold text-foreground">
                      No local writing history yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Start one writing task and submit the first attempt to build
                      visible history in this browser.
                    </p>
                  </InsetPanel>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard tone="lavender" className="p-5" id="draft-stack">
            <SectionEyebrow icon={History}>Draft stack</SectionEyebrow>
            <div className="mt-5 grid gap-3">
              {recentDrafts.length > 0 ? (
                recentDrafts.map((draft, index) => (
                  <motion.div
                    key={draft.id}
                    {...getWorkspaceItemMotion(reduced, index)}
                  >
                    <InsetPanel id={`draft-${draft.id}`} className="p-4">
                      <p className="text-sm font-semibold text-foreground">{draft.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Updated {formatRelativeTimestamp(draft.updatedAt)}
                      </p>
                      {draft.lastSubmittedAt ? (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Submitted {formatRelativeTimestamp(draft.lastSubmittedAt)}
                        </p>
                      ) : null}
                      {draft.taskId ? (
                        <div className="mobile-stacked-actions mt-4">
                          <Link
                            href="#draft-workspace"
                            onClick={() => workspace.handleSelectTask(draft.taskId!)}
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "w-full",
                            )}
                          >
                            Open draft
                          </Link>
                        </div>
                      ) : null}
                    </InsetPanel>
                  </motion.div>
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
        </div>
      </motion.div>

      <motion.div {...getWorkspaceRevealMotion(reduced, 2)}>
        <DashboardCard tone="default" className="p-5 sm:p-6" id="task-list">
          <SectionEyebrow icon={ListChecks}>Writing task list</SectionEyebrow>
          <div className="mt-5 grid gap-3">
            {workspace.tasks.length > 0 ? (
              workspace.tasks.map((task) => (
                <InsetPanel
                  key={task.id}
                  tone={task.isActive ? "pink" : task.draft ? "lavender" : "default"}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <SmallTag>{task.stageTitle}</SmallTag>
                        <SmallTag>{task.blockTitle}</SmallTag>
                        {task.draft ? <SmallTag>Draft waiting</SmallTag> : null}
                        {!task.draft && task.isRecommended ? (
                          <SmallTag>Recommended now</SmallTag>
                        ) : null}
                      </div>
                      <p className="mt-3 text-lg font-semibold text-foreground">
                        {task.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {task.summary ?? task.instructions}
                      </p>
                    </div>
                    {task.isActive ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-surface-dark-control px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                        <CheckCircle2 className="size-3.5" />
                        In focus
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {task.estimatedMinutes ? (
                      <SmallTag>{task.estimatedMinutes} min</SmallTag>
                    ) : null}
                    {task.wordCountMin || task.wordCountMax ? (
                      <SmallTag>
                        {formatWordRange(task.wordCountMin, task.wordCountMax)}
                      </SmallTag>
                    ) : null}
                  </div>

                  {task.isActive ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                      <InsetPanel className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Assignment
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {task.instructions}
                        </p>
                      </InsetPanel>
                      <InsetPanel tone="cream" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Success target
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {task.successCriteria ??
                            "Keep the response clear, personal, and easy to revise once you finish the first pass."}
                        </p>
                      </InsetPanel>
                    </div>
                  ) : null}

                  <div className="mobile-stacked-actions mt-5">
                    {task.draft ? (
                      <Link
                        href="#draft-workspace"
                        onClick={() => workspace.handleSelectTask(task.id)}
                        className={cn(buttonVariants(), "sm:w-auto")}
                      >
                        Continue draft
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void workspace.handleCreateDraft(task)}
                        className={cn(buttonVariants(), "sm:w-auto")}
                      >
                        Start draft
                      </button>
                    )}

                    {!task.isActive ? (
                      <button
                        type="button"
                        onClick={() => workspace.handleSelectTask(task.id)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "sm:w-auto",
                        )}
                      >
                        Preview task
                      </button>
                    ) : null}
                  </div>
                </InsetPanel>
              ))
            ) : (
              <InsetPanel tone="cream" className="p-4">
                <p className="text-sm font-semibold text-foreground">No writing tasks yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Seeded writing tasks will appear here once the current roadmap blocks
                  include output work.
                </p>
              </InsetPanel>
            )}
          </div>
        </DashboardCard>
      </motion.div>
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

function formatSaveState(state: "idle" | "dirty" | "saved" | "saving" | "submitting") {
  switch (state) {
    case "dirty":
      return "Unsaved changes";
    case "saving":
      return "Saving locally";
    case "submitting":
      return "Submitting";
    case "saved":
      return "Saved locally";
    default:
      return "Ready";
  }
}
