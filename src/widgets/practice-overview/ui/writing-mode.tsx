"use client";

import type { ElementType, ReactNode } from "react";
import { ArrowRight, Check, LoaderCircle, PenSquare, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

import type { DashboardContentState } from "@/entities/dashboard";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { cn } from "@/shared/lib/utils";
import { getWorkspaceSwapMotion } from "@/shared/lib/workspace-motion";
import { buttonVariants } from "@/shared/ui/button";
import { InsetPanel, SmallTag, type SurfaceTone } from "@/shared/ui/surfaces";
import { formatRelativeTimestamp } from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";

import {
  getSubmissionSummary,
  getWordTargetGuidance,
} from "../model/writing/writing-draft-helpers";
import { useWritingWorkspace } from "../model/writing/use-writing-workspace";

type WritingModeProps = {
  content: DashboardContentState;
};

type WritingWorkspaceApi = ReturnType<typeof useWritingWorkspace>;
type WritingVerdict = "pass" | "retry" | "needs_work";

type VerdictCopy = {
  label: string;
  icon: ElementType;
  tone: SurfaceTone;
  eyebrow: string;
};

const VERDICT_COPY: Record<WritingVerdict, VerdictCopy> = {
  pass: {
    label: "Pass",
    icon: Check,
    tone: "green",
    eyebrow: "Ready to move on",
  },
  retry: {
    label: "Try again",
    icon: RotateCcw,
    tone: "lavender",
    eyebrow: "Another attempt will help",
  },
  needs_work: {
    label: "Needs work",
    icon: ArrowRight,
    tone: "cream",
    eyebrow: "Close, but one more pass is worth it",
  },
};

function VerdictBadge({
  feedbackSummary,
  verdict,
}: {
  feedbackSummary: string;
  verdict: WritingVerdict;
}) {
  const copy = VERDICT_COPY[verdict];
  const Icon = copy.icon;
  return (
    <InsetPanel tone={copy.tone} className="p-5">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{copy.eyebrow}</span>
        <SmallTag>{copy.label}</SmallTag>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{feedbackSummary}</p>
    </InsetPanel>
  );
}

export function WritingMode({ content }: WritingModeProps) {
  const reduced = useReducedMotion();
  const workspace = useWritingWorkspace(content);
  const activeTask = workspace.activeTask;
  const activeDraft = workspace.activeDraft;
  const AiFeedbackLoading = workspace.aiFeedbackLoading;
  const submissionSummary = activeDraft
    ? getSubmissionSummary(activeDraft)
    : {
        detail: "Submit one attempt to open the next feedback step.",
        label: "No submission yet",
      };
  const wordGuidance = getWordTargetGuidance(
    workspace.wordCount,
    activeTask?.wordCountMin,
    activeTask?.wordCountMax,
  );
  const hasSubmission = activeDraft?.lastSubmittedAt != null;
  const isLastTask =
    workspace.tasks.length > 0 &&
    workspace.tasks.findIndex((task) => task.id === activeTask?.id) ===
      workspace.tasks.length - 1;
  const motionProps = getWorkspaceSwapMotion(reduced);

  return (
    <motion.div className="space-y-5" {...motionProps}>
      {activeTask && !AiFeedbackLoading ? (
        <StudioPromptStrip
          icon={PenSquare}
          label="Writing prompt"
          meta={formatWritingMeta(activeTask)}
          control={
            workspace.tasks.length > 1 ? (
              <StudioSelect
                ariaLabel="Choose writing task"
                onChange={workspace.handleSelectTask}
                options={workspace.tasks.map((task) => ({
                  label: task.title,
                  value: task.id,
                }))}
                value={activeTask?.id ?? workspace.tasks[0]?.id ?? ""}
              />
            ) : null
          }
        >
          {activeTask?.instructions ??
            "Writing work appears here when the current roadmap block includes output practice."}
        </StudioPromptStrip>
      ) : null}

      <StudioNoticeStack notice={workspace.notice} error={workspace.workspaceError} />

      {workspace.isLoadingDraft ? (
        <StudioActiveArea muted>
          <div className="flex min-h-[24rem] items-center justify-center text-sm text-muted-foreground sm:min-h-[28rem]">
            <div className="flex items-center gap-3">
              <LoaderCircle className="size-4 animate-spin" />
              Opening the writing canvas...
            </div>
          </div>
        </StudioActiveArea>
      ) : activeTask ? (
        activeDraft && !hasSubmission ? (
          <StudioActiveArea>
            <textarea
              id="practice-writing-editor"
              value={workspace.editorContent}
              onChange={(event) => workspace.handleEditorChange(event.target.value)}
              placeholder="Write your response here. Start simply, then tighten the next pass."
              className="min-h-[24rem] w-full resize-none rounded-[1.9rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-[var(--motion-duration-fast)] ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35 sm:min-h-[28rem] sm:px-5 sm:py-5"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{wordGuidance}</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  {getWritingStatusLine(workspace.saveState, activeDraft.lastSubmittedAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void workspace.handleSubmitAndRequestFeedback()}
                className={buttonVariants({ size: "lg" })}
                disabled={workspace.saveState === "submitting"}
              >
                {workspace.saveState === "submitting" ? "Saving..." : "Save writing"}
              </button>
            </div>
          </StudioActiveArea>
        ) : activeDraft && hasSubmission ? (
          <StudioActiveArea>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-foreground">{submissionSummary.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {submissionSummary.detail}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Saved {formatRelativeTimestamp(activeDraft.lastSubmittedAt ?? Date.now())}
                </p>
              </div>

              {workspace.aiFeedbackLoading ? (
                <div className="flex items-center gap-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel p-4">
                  <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing your writing...
                  </p>
                </div>
              ) : null}

              {workspace.aiFeedbackError && !workspace.aiFeedbackLoading ? (
                <InlineMessage tone="error">
                  {workspace.aiFeedbackError}
                </InlineMessage>
              ) : null}

              {workspace.aiFeedback ? (
                <div className="space-y-4">
                  <VerdictBadge
                    verdict={workspace.aiFeedback.verdict}
                    feedbackSummary={workspace.aiFeedback.feedbackSummary}
                  />

                  <InsetPanel className="p-4">
                    <p className="text-sm leading-6 text-foreground">
                      {workspace.aiFeedback.overallSummary}
                    </p>
                  </InsetPanel>

                  {workspace.aiFeedback.keyIssues?.length > 0 ? (
                    <div className="grid gap-3">
                      {workspace.aiFeedback.keyIssues.map((issue) => (
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
                  ) : null}

                  {workspace.aiFeedback.correctedVersion ? (
                    <InsetPanel className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        AI-suggested correction
                      </p>
                      <p className="mt-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel px-4 py-3 text-sm leading-7 text-foreground">
                        {workspace.aiFeedback.correctedVersion}
                      </p>
                    </InsetPanel>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {workspace.aiFeedback.grammarNotes?.length > 0 ? (
                      <InsetPanel className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Grammar notes
                        </p>
                        <div className="mt-3 space-y-2">
                          {workspace.aiFeedback.grammarNotes.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>
                    ) : null}

                    {workspace.aiFeedback.naturalnessSuggestions?.length > 0 ? (
                      <InsetPanel tone="lavender" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Naturalness
                        </p>
                        <div className="mt-3 space-y-2">
                          {workspace.aiFeedback.naturalnessSuggestions.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>
                    ) : null}

                    {workspace.aiFeedback.vocabularySuggestions?.length > 0 ? (
                      <InsetPanel tone="blue" className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Vocabulary
                        </p>
                        <div className="mt-3 space-y-2">
                          {workspace.aiFeedback.vocabularySuggestions.map((note) => (
                            <p key={note} className="text-sm leading-6 text-foreground">
                              {note}
                            </p>
                          ))}
                        </div>
                      </InsetPanel>
                    ) : null}

                    {workspace.aiFeedback.detectedPatterns?.length > 0 ? (
                      <InsetPanel className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Patterns
                        </p>
                        <div className="mt-3 space-y-3">
                          {workspace.aiFeedback.detectedPatterns.map((pattern) => (
                            <div key={pattern.label}>
                              <SmallTag>{pattern.label}</SmallTag>
                              <p className="mt-2 text-sm leading-6 text-foreground">
                                {pattern.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </InsetPanel>
                    ) : null}
                  </div>

                  {workspace.aiFeedback.nextPracticeFocus ? (
                    <InsetPanel tone="green" className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Next practice focus
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {workspace.aiFeedback.nextPracticeFocus}
                      </p>
                    </InsetPanel>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-surface-stroke pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => void workspace.handleTryAgain()}
                  className={buttonVariants({ variant: "outline" })}
                  disabled={workspace.aiFeedbackLoading}
                >
                  <RotateCcw className="mr-2 size-4" />
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => workspace.handleNextTask()}
                  className={buttonVariants({ size: "lg" })}
                  disabled={workspace.aiFeedbackLoading}
                >
                  {isLastTask ? "Start over" : "Next"}
                  <ArrowRight className="ml-2 size-4" />
                </button>
              </div>
            </div>
          </StudioActiveArea>
        ) : (
          <StudioActiveArea muted centered>
            <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
              The writing canvas is ready
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Start in this same studio. The draft stays local, and the feedback step
              stays reserved below for the first submission.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => void workspace.handleCreateDraft(activeTask)}
                className={buttonVariants({ size: "lg" })}
              >
                Start writing
              </button>
            </div>
          </StudioActiveArea>
        )
      ) : (
        <StudioActiveArea muted centered>
          <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
            No writing task yet
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Seeded writing tasks will appear here when the current roadmap block
            includes written output practice.
          </p>
        </StudioActiveArea>
      )}
    </motion.div>
  );
}

/* ─── shared sub-components ─── */

function StudioPromptStrip({
  children,
  control,
  icon: Icon,
  label,
  meta,
}: {
  children: ReactNode;
  control?: ReactNode;
  icon: typeof PenSquare;
  label: string;
  meta: string | null;
}) {
  return (
    <div className="border-b border-surface-stroke pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className="size-3.5" />
            <span>{label}</span>
            {meta ? (
              <span className="normal-case tracking-normal text-muted-foreground">
                {meta}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-7 text-foreground sm:text-[1rem]">
            {children}
          </p>
        </div>

        {control ? <div className="sm:shrink-0">{control}</div> : null}
      </div>
    </div>
  );
}

function StudioNoticeStack({
  error,
  notice,
}: {
  error: string | null;
  notice: string | null;
}) {
  if (!notice && !error) {
    return null;
  }

  return (
    <div className="space-y-2">
      {notice ? <InlineMessage tone="success">{notice}</InlineMessage> : null}
      {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
    </div>
  );
}

function StudioActiveArea({
  centered = false,
  children,
  className,
  muted = false,
}: {
  centered?: boolean;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_18px_42px_rgba(20,20,30,0.06)] sm:px-5 sm:py-5",
        muted
          ? "border-surface-stroke-strong bg-[linear-gradient(180deg,var(--surface-panel-muted),var(--surface-panel))]"
          : "border-surface-stroke-strong bg-[linear-gradient(180deg,var(--surface-panel),var(--surface-panel-muted))]",
        centered &&
          "flex min-h-[24rem] flex-col items-center justify-center text-center sm:min-h-[28rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function InlineMessage({
  children,
  tone,
}: {
  children: string;
  tone: "error" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] border px-4 py-3 text-sm",
        tone === "success" &&
          "border-state-complete-border bg-surface-state-success text-state-complete-text",
        tone === "error" && "border-destructive/20 bg-destructive/10 text-destructive",
      )}
    >
      {children}
    </div>
  );
}

function StudioSelect({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="sr-only">
      {ariaLabel}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-[13rem] rounded-full border border-surface-stroke-strong bg-surface-panel px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-[var(--motion-duration-fast)] ease-out focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ─── helper functions ─── */

function formatWritingMeta(
  task: ReturnType<typeof useWritingWorkspace>["activeTask"] | undefined | null,
) {
  if (!task) {
    return null;
  }

  return joinMetaParts([
    task.blockTitle,
    task.estimatedMinutes ? `${task.estimatedMinutes} min` : null,
    formatWordRange(task.wordCountMin, task.wordCountMax),
  ]);
}

function getWritingStatusLine(
  saveState: WritingWorkspaceApi["saveState"],
  lastSubmittedAt: number | null | undefined,
) {
  if (saveState === "submitting") {
    return "Recording the submission locally...";
  }

  if (saveState === "saving" || saveState === "dirty") {
    return "Saving changes locally...";
  }

  if (lastSubmittedAt) {
    return `Latest submission ${formatRelativeTimestamp(lastSubmittedAt)}.`;
  }

  if (saveState === "saved") {
    return "Draft saved locally.";
  }

  return "Start writing when you are ready.";
}

function joinMetaParts(parts: Array<string | null>) {
  const filteredParts = parts.filter(Boolean);

  return filteredParts.length > 0 ? filteredParts.join(" / ") : null;
}

function formatWordRange(min: number | null, max: number | null) {
  if (min && max) {
    return `${min}-${max} words`;
  }

  if (min) {
    return `${min}+ words`;
  }

  if (max) {
    return `up to ${max} words`;
  }

  return null;
}
