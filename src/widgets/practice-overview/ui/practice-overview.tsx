"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Mic, PenSquare, Waves } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { DashboardContentState } from "@/entities/dashboard";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { cn } from "@/shared/lib/utils";
import {
  getWorkspaceShellMotion,
  getWorkspaceSwapMotion,
} from "@/shared/lib/workspace-motion";
import { buttonVariants } from "@/shared/ui/button";
import { WorkspaceFrame } from "@/shared/ui/surfaces";
import { formatRelativeTimestamp } from "@/widgets/dashboard-overview/model/dashboard-overview-formatters";
import {
  getSubmissionSummary,
  getWordTargetGuidance,
} from "@/widgets/writing-overview/model/writing-draft-helpers";
import { useWritingWorkspace } from "@/widgets/writing-overview/model/use-writing-workspace";
import { formatSpeakingDuration } from "@/widgets/speaking-overview/model/speaking-session-helpers";
import { useSpeakingWorkspace } from "@/widgets/speaking-overview/model/use-speaking-workspace";

type PracticeMode = "writing" | "speaking";

type PracticeOverviewProps = {
  content: DashboardContentState;
  mode: PracticeMode;
};

type WritingWorkspaceApi = ReturnType<typeof useWritingWorkspace>;
type SpeakingWorkspaceApi = ReturnType<typeof useSpeakingWorkspace>;

const practiceModes: Array<{
  icon: typeof PenSquare;
  key: PracticeMode;
  title: string;
}> = [
  {
    key: "writing",
    title: "Writing",
    icon: PenSquare,
  },
  {
    key: "speaking",
    title: "Speaking",
    icon: Mic,
  },
];

export function PracticeOverview({ content, mode: initialMode }: PracticeOverviewProps) {
  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;
  const writingWorkspace = useWritingWorkspace(content);
  const speakingWorkspace = useSpeakingWorkspace(content);
  const [mode, setMode] = useState<PracticeMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handlePopState = () => {
      setMode(readModeFromLocation());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleModeChange(nextMode: PracticeMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    window.history.pushState({ mode: nextMode }, "", `/practice?mode=${nextMode}`);
  }

  return (
    <Wrapper
      className="mx-auto w-full max-w-[72rem]"
      {...getWorkspaceShellMotion(reduced)}
    >
      <WorkspaceFrame className="relative border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,241,235,0.9))] px-4 py-5 shadow-[0_30px_80px_rgba(20,20,30,0.1)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,199,255,0.28),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(182,232,224,0.22),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,224,192,0.16),transparent_30%)]"
        />

        <div className="relative">
          <PracticeModeSwitch mode={mode} onChange={handleModeChange} reduced={reduced} />

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={mode}
              className="mt-6 sm:mt-8"
              id={`${mode}-workspace`}
              role="tabpanel"
              aria-label={`${mode} workspace`}
              {...getWorkspaceSwapMotion(reduced, 14)}
            >
              {mode === "writing" ? (
                <WritingStudio workspace={writingWorkspace} />
              ) : (
                <SpeakingStudio workspace={speakingWorkspace} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </WorkspaceFrame>
    </Wrapper>
  );
}

function PracticeModeSwitch({
  mode,
  onChange,
  reduced,
}: {
  mode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
  reduced: boolean;
}) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Practice mode"
        className="inline-grid grid-cols-2 rounded-full border border-white/70 bg-white/76 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.84),0_16px_38px_rgba(20,20,30,0.08)] backdrop-blur"
      >
        {practiceModes.map((item) => {
          const isActive = item.key === mode;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-label={`${item.title} mode`}
              aria-selected={isActive}
              aria-controls={`${item.key}-workspace`}
              onClick={() => onChange(item.key)}
              className={cn(
                "relative min-w-[9.75rem] rounded-full px-5 py-3 text-sm font-semibold tracking-tight transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] sm:min-w-[11rem]",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                reduced ? (
                  <span className="absolute inset-0 rounded-full bg-surface-dark-control shadow-[0_14px_30px_rgba(17,17,20,0.18)]" />
                ) : (
                  <motion.span
                    layoutId="practice-mode-pill"
                    className="absolute inset-0 rounded-full bg-surface-dark-control shadow-[0_14px_30px_rgba(17,17,20,0.18)]"
                  />
                )
              ) : null}

              <span className="relative flex items-center justify-center gap-2">
                <Icon className="size-4" />
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WritingStudio({ workspace }: { workspace: WritingWorkspaceApi }) {
  const activeTask = workspace.activeTask;
  const activeDraft = workspace.activeDraft;
  const submissionSummary = activeDraft
    ? getSubmissionSummary(activeDraft)
    : {
        detail: "Feedback will appear here after submission.",
        label: "Nothing submitted yet",
      };
  const wordGuidance = getWordTargetGuidance(
    workspace.wordCount,
    activeTask?.wordCountMin,
    activeTask?.wordCountMax,
  );

  return (
    <div className="space-y-6">
      <StudioPromptLine
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
          "Writing prompt will appear here when the current roadmap block includes written output practice."}
      </StudioPromptLine>

      <div className="space-y-4">
        {workspace.notice ? <InlineMessage tone="success">{workspace.notice}</InlineMessage> : null}
        {workspace.workspaceError ? (
          <InlineMessage tone="error">{workspace.workspaceError}</InlineMessage>
        ) : null}

        {workspace.isLoadingDraft ? (
          <StudioCanvas muted>
            <div className="flex min-h-[23rem] items-center justify-center text-sm text-muted-foreground sm:min-h-[27rem]">
              <div className="flex items-center gap-3">
                <LoaderCircle className="size-4 animate-spin" />
                Opening the writing canvas...
              </div>
            </div>
          </StudioCanvas>
        ) : activeTask ? (
          activeDraft ? (
            <StudioCanvas>
              <textarea
                id="practice-writing-editor"
                value={workspace.editorContent}
                onChange={(event) => workspace.handleEditorChange(event.target.value)}
                placeholder="Write your response here. Start simply, then tighten the next pass."
                className="min-h-[23rem] w-full resize-none rounded-[1.65rem] border border-white/80 bg-white/58 px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-lavender/45 sm:min-h-[27rem] sm:px-5 sm:py-5"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1 text-sm leading-6 text-muted-foreground">
                  <p>{wordGuidance}</p>
                  {activeDraft.lastSubmittedAt ? (
                    <p>
                      Latest local submission was{" "}
                      {formatRelativeTimestamp(activeDraft.lastSubmittedAt)}.
                    </p>
                  ) : (
                    <p>Feedback will appear here after submission.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void workspace.handleSaveNow()}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Save now
                  </button>
                  <button
                    type="button"
                    onClick={() => void workspace.handleSubmitDraft()}
                    className={buttonVariants({ size: "lg" })}
                    disabled={workspace.saveState === "submitting"}
                  >
                    Submit writing
                  </button>
                </div>
              </div>
            </StudioCanvas>
          ) : (
            <StudioCanvas muted>
              <div className="flex min-h-[23rem] flex-col items-center justify-center text-center sm:min-h-[27rem]">
                <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
                  The writing canvas is ready
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  Start writing in this same surface. The draft stays local, and the
                  feedback area below stays reserved for the first submission.
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
              </div>
            </StudioCanvas>
          )
        ) : (
          <StudioCanvas muted>
            <div className="flex min-h-[23rem] flex-col items-center justify-center text-center sm:min-h-[27rem]">
              <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
                No writing task yet
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Seeded writing tasks will appear here when the roadmap block includes
                output practice.
              </p>
            </div>
          </StudioCanvas>
        )}
      </div>

      <StudioFooter
        icon={CheckCircle2}
        label="Feedback"
        lead="Feedback will appear here after submission."
        body="AI feedback will be connected later. This workspace is ready for writing submissions."
        detail={activeDraft?.lastSubmittedAt ? submissionSummary.detail : undefined}
      />
    </div>
  );
}

function SpeakingStudio({ workspace }: { workspace: SpeakingWorkspaceApi }) {
  const activePrompt = workspace.activePrompt;
  const activeSession = workspace.activeSession;

  return (
    <div className="space-y-6">
      <StudioPromptLine
        icon={Mic}
        label="Speaking prompt"
        meta={formatSpeakingMeta(activePrompt)}
        control={
          workspace.prompts.length > 1 ? (
            <StudioSelect
              ariaLabel="Choose speaking prompt"
              onChange={workspace.handleSelectPrompt}
              options={workspace.prompts.map((prompt) => ({
                label: prompt.title,
                value: prompt.id,
              }))}
              value={activePrompt?.id ?? workspace.prompts[0]?.id ?? ""}
            />
          ) : null
        }
      >
        {activePrompt?.promptText ??
          "Speaking prompt will appear here when the current roadmap block includes spoken output practice."}
      </StudioPromptLine>

      <div className="space-y-4">
        {workspace.notice ? <InlineMessage tone="success">{workspace.notice}</InlineMessage> : null}
        {workspace.workspaceError ? (
          <InlineMessage tone="error">{workspace.workspaceError}</InlineMessage>
        ) : null}

        {activePrompt ? (
          activeSession ? (
            activeSession.status === "reflecting" ? (
              <StudioCanvas>
                <div className="space-y-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[1.45rem] font-semibold tracking-tight text-foreground">
                        Add one reflection and a rough transcript
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Keep it honest and lightweight. This is the future handoff point
                        for transcript-based feedback.
                      </p>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {formatSpeakingDuration(workspace.elapsedSeconds)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {workspace.reflectionOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => workspace.handleChooseReflection(option.value)}
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm transition-all duration-200 ease-out",
                          activeSession.reflection === option.value
                            ? "border-transparent bg-surface-dark-control text-primary-foreground shadow-[0_12px_24px_rgba(17,17,20,0.16)]"
                            : "border-white/80 bg-white/56 text-foreground hover:bg-white/74",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    id="practice-speaking-transcript"
                    value={workspace.transcriptDraft}
                    onChange={(event) => workspace.handleTranscriptChange(event.target.value)}
                    placeholder="Type or paste a rough transcript of what you said."
                    className="min-h-[16rem] w-full resize-none rounded-[1.65rem] border border-white/80 bg-white/58 px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-lavender/45 sm:px-5 sm:py-5"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {workspace.transcriptSummary.detail}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => workspace.handleClearSession()}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Clear session
                      </button>
                      <button
                        type="button"
                        onClick={() => void workspace.handleSaveSession()}
                        className={buttonVariants({ size: "lg" })}
                      >
                        Save speaking attempt
                      </button>
                    </div>
                  </div>
                </div>
              </StudioCanvas>
            ) : (
              <StudioCanvas muted>
                <div className="flex min-h-[23rem] flex-col items-center justify-center text-center sm:min-h-[27rem]">
                  <div className="flex size-16 items-center justify-center rounded-full bg-surface-dark-control text-primary-foreground shadow-control">
                    <Waves className="size-6" />
                  </div>
                  <p className="mt-6 text-[3rem] font-semibold tracking-tight text-foreground sm:text-[4.5rem]">
                    {formatSpeakingDuration(workspace.elapsedSeconds)}
                  </p>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                    Audio recording is not connected yet. This studio still tracks the
                    local speaking session and keeps the transcript handoff ready for
                    later feedback.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {activeSession.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => workspace.handlePauseSession()}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => workspace.handleResumeSession()}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Resume
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => workspace.handleFinishSession()}
                      className={buttonVariants({ size: "lg" })}
                    >
                      Finish speaking
                    </button>
                  </div>
                </div>
              </StudioCanvas>
            )
          ) : (
            <StudioCanvas muted>
              <div className="flex min-h-[23rem] flex-col items-center justify-center text-center sm:min-h-[27rem]">
                <div className="flex size-16 items-center justify-center rounded-full bg-surface-dark-control text-primary-foreground shadow-control">
                  <Mic className="size-6" />
                </div>
                <p className="mt-6 text-[1.7rem] font-semibold tracking-tight text-foreground">
                  Start a speaking attempt here
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                  Use one focused speaking surface: answer the prompt, finish the
                  session, then leave a rough transcript in the same studio.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => workspace.handleStartSession()}
                    className={buttonVariants({ size: "lg" })}
                  >
                    Start speaking
                  </button>
                </div>
              </div>
            </StudioCanvas>
          )
        ) : (
          <StudioCanvas muted>
            <div className="flex min-h-[23rem] flex-col items-center justify-center text-center sm:min-h-[27rem]">
              <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
                No speaking prompt yet
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                Seeded speaking prompts will appear here when the roadmap block includes
                spoken output practice.
              </p>
            </div>
          </StudioCanvas>
        )}
      </div>

      <StudioFooter
        icon={Mic}
        label="Transcript and feedback"
        lead="Transcript and feedback will appear here after submission."
        body="Speaking feedback will be connected later. This workspace is ready for speaking submissions."
        detail={
          activeSession?.status === "reflecting"
            ? workspace.transcriptSummary.detail
            : workspace.reflectionLabel
              ? `Latest reflection signal: ${workspace.reflectionLabel}.`
              : undefined
        }
      />
    </div>
  );
}

function StudioPromptLine({
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
    <div className="border-b border-white/70 pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className="size-3.5" />
            <span>{label}</span>
            {meta ? <span className="normal-case tracking-normal">{meta}</span> : null}
          </div>
          <p className="mt-3 text-base leading-7 text-foreground sm:text-[1.02rem]">
            {children}
          </p>
        </div>

        {control ? <div className="sm:shrink-0">{control}</div> : null}
      </div>
    </div>
  );
}

function StudioCanvas({
  children,
  muted = false,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_18px_42px_rgba(20,20,30,0.06)] sm:px-5 sm:py-5",
        muted
          ? "border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(247,243,237,0.78))]"
          : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.5))]",
      )}
    >
      {children}
    </div>
  );
}

function StudioFooter({
  body,
  detail,
  icon: Icon,
  label,
  lead,
}: {
  body: string;
  detail?: string;
  icon: typeof PenSquare;
  label: string;
  lead: string;
}) {
  return (
    <div className="border-t border-white/70 pt-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/75 bg-white/58 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground">{lead}</p>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">{body}</p>
          {detail ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
          ) : null}
        </div>
      </div>
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
        "rounded-[1.1rem] border px-4 py-3 text-sm",
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
        className="min-w-[13rem] rounded-full border border-white/80 bg-white/78 px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] outline-none transition-all duration-200 ease-out focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-lavender/45"
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

function formatWritingMeta(
  task:
    | WritingWorkspaceApi["activeTask"]
    | undefined
    | null,
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

function formatSpeakingMeta(
  prompt:
    | SpeakingWorkspaceApi["activePrompt"]
    | undefined
    | null,
) {
  if (!prompt) {
    return null;
  }

  return joinMetaParts([
    prompt.blockTitle,
    prompt.estimatedMinutes ? `${prompt.estimatedMinutes} min` : null,
    formatTargetDuration(prompt.targetDurationSeconds),
  ]);
}

function joinMetaParts(parts: Array<string | null>) {
  const filteredParts = parts.filter(Boolean);

  return filteredParts.length > 0 ? filteredParts.join(" • ") : null;
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

function formatTargetDuration(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) {
    return null;
  }

  if (seconds < 60) {
    return `${seconds}s target`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min target`;
  }

  return `${minutes} min ${remainingSeconds}s target`;
}

function readModeFromLocation(): PracticeMode {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get("mode") === "speaking" ? "speaking" : "writing";
}
