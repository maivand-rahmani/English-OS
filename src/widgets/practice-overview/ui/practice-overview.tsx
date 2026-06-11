"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { LoaderCircle, Mic, PenSquare, Waves } from "lucide-react";
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
  const [mode, setMode] = useState<PracticeMode>(() => initialMode);

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
      className="mx-auto w-full max-w-[68rem]"
      {...getWorkspaceShellMotion(reduced)}
    >
      <WorkspaceFrame className="relative overflow-hidden border-surface-stroke-strong bg-[linear-gradient(180deg,var(--surface-panel-strong),var(--surface-panel))] shadow-float">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--surface-highlight),transparent_42%),radial-gradient(circle_at_14%_18%,var(--surface-module-cream),transparent_26%),radial-gradient(circle_at_86%_16%,var(--surface-module-blue),transparent_24%),radial-gradient(circle_at_50%_100%,var(--surface-module-green),transparent_26%)]"
        />

        <div className="relative">
          <div className="border-b border-surface-stroke px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <PracticeModeSwitch mode={mode} onChange={handleModeChange} reduced={reduced} />
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={mode}
              className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
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
        className="inline-grid grid-cols-2 rounded-full border border-surface-stroke-strong bg-surface-panel p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_36px_rgba(20,20,30,0.08)] backdrop-blur"
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
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                reduced ? (
                  <span className="absolute inset-0 rounded-full bg-primary shadow-control" />
                ) : (
                  <motion.span
                    layoutId="practice-mode-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-control"
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
        detail: "Submit one attempt to open the next feedback step.",
        label: "No submission yet",
      };
  const wordGuidance = getWordTargetGuidance(
    workspace.wordCount,
    activeTask?.wordCountMin,
    activeTask?.wordCountMax,
  );

  return (
    <div className="space-y-5">
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
        activeDraft ? (
          <StudioActiveArea>
            <textarea
              id="practice-writing-editor"
              value={workspace.editorContent}
              onChange={(event) => workspace.handleEditorChange(event.target.value)}
              placeholder="Write your response here. Start simply, then tighten the next pass."
              className="min-h-[24rem] w-full resize-none rounded-[1.9rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35 sm:min-h-[28rem] sm:px-5 sm:py-5"
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
                onClick={() => void workspace.handleSubmitDraft()}
                className={buttonVariants({ size: "lg" })}
                disabled={workspace.saveState === "submitting"}
              >
                Submit writing
              </button>
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

      <StudioFeedbackRegion
        title={
          activeDraft?.lastSubmittedAt
            ? submissionSummary.label
            : "Feedback will appear here after your first submission."
        }
        detail={
          activeDraft?.lastSubmittedAt
            ? submissionSummary.detail
            : "AI review is not connected yet. This reserved area is ready for the next feedback step."
        }
        meta={
          activeDraft?.lastSubmittedAt
            ? `Latest local submission ${formatRelativeTimestamp(activeDraft.lastSubmittedAt)}.`
            : null
        }
      />
    </div>
  );
}

function SpeakingStudio({ workspace }: { workspace: SpeakingWorkspaceApi }) {
  const activePrompt = workspace.activePrompt;
  const activeSession = workspace.activeSession;

  return (
    <div className="space-y-5">
      <StudioPromptStrip
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
          "Speaking work appears here when the current roadmap block includes output practice."}
      </StudioPromptStrip>

      <StudioNoticeStack notice={workspace.notice} error={workspace.workspaceError} />

      {activePrompt ? (
        activeSession ? (
          activeSession.status === "reflecting" ? (
            <StudioActiveArea>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[1.45rem] font-semibold tracking-tight text-foreground">
                    Capture the attempt while it is still fresh
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {workspace.sessionSummary.detail}
                  </p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {formatSpeakingDuration(workspace.elapsedSeconds)}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {workspace.reflectionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => workspace.handleChooseReflection(option.value)}
                    className={cn(
                        "rounded-full border px-3 py-2 text-sm transition-all duration-200 ease-out",
                        activeSession.reflection === option.value
                        ? "border-transparent bg-primary text-primary-foreground shadow-control"
                        : "border-surface-stroke-strong bg-surface-panel text-foreground hover:bg-surface-panel-strong",
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
                className="mt-5 min-h-[16rem] w-full resize-none rounded-[1.9rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35 sm:px-5 sm:py-5"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
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
            </StudioActiveArea>
          ) : (
            <StudioActiveArea centered>
              <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-control">
                <Waves className="size-6" />
              </div>
              <p className="mt-6 text-[3rem] font-semibold tracking-tight text-foreground sm:text-[4.5rem]">
                {formatSpeakingDuration(workspace.elapsedSeconds)}
              </p>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                {workspace.sessionSummary.detail}
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
            </StudioActiveArea>
          )
        ) : (
          <StudioActiveArea muted centered>
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-control">
              <Mic className="size-6" />
            </div>
            <p className="mt-6 text-[1.7rem] font-semibold tracking-tight text-foreground">
              Start a speaking attempt here
            </p>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              Answer the prompt in this same studio, then leave a quick reflection and
              rough transcript before saving the attempt.
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
          </StudioActiveArea>
        )
      ) : (
        <StudioActiveArea muted centered>
          <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">
            No speaking prompt yet
          </p>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            Seeded speaking prompts will appear here when the current roadmap block
            includes spoken output practice.
          </p>
        </StudioActiveArea>
      )}

      <StudioFeedbackRegion
        title={
          activeSession?.status === "reflecting"
            ? "Transcript is ready for the next feedback step."
            : "Transcript and feedback will appear here after you save the attempt."
        }
        detail={
          activeSession?.status === "reflecting"
            ? workspace.transcriptSummary.detail
            : workspace.reflectionLabel
              ? `Latest reflection signal: ${workspace.reflectionLabel}.`
              : "Audio analysis is not connected yet. This reserved area will hold transcript-based feedback later."
        }
        meta={activeSession ? workspace.sessionSummary.label : null}
      />
    </div>
  );
}

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
        centered && "flex min-h-[24rem] flex-col items-center justify-center text-center sm:min-h-[28rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StudioFeedbackRegion({
  detail,
  meta,
  title,
}: {
  detail: string;
  meta?: string | null;
  title: string;
}) {
  return (
    <div className="border-t border-surface-stroke pt-5">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
      {meta ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{meta}</p>
      ) : null}
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
        className="min-w-[13rem] rounded-full border border-surface-stroke-strong bg-surface-panel px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-200 ease-out focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35"
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

function formatWritingMeta(task: WritingWorkspaceApi["activeTask"] | undefined | null) {
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
  prompt: SpeakingWorkspaceApi["activePrompt"] | undefined | null,
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
