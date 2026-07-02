"use client";

import type { ReactNode } from "react";
import { LoaderCircle, Mic, Sparkles, Waves } from "lucide-react";

import type { DashboardContentState } from "@/entities/dashboard";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { InsetPanel, SmallTag } from "@/shared/ui/surfaces";

import { formatSpeakingDuration } from "../model/speaking/speaking-session-helpers";
import { useSpeakingWorkspace } from "../model/speaking/use-speaking-workspace";

type SpeakingModeProps = {
  content: DashboardContentState;
};

export function SpeakingMode({ content }: SpeakingModeProps) {
  const workspace = useSpeakingWorkspace(content);
  const activePrompt = workspace.activePrompt;
  const activeSession = workspace.activeSession;
  const transcriptDraft = activeSession?.transcriptDraft ?? "";

  async function handleRequestAiFeedback() {
    if (!activePrompt || !transcriptDraft.trim()) return;
    await workspace.requestAiFeedback();
  }

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
                      "rounded-full border px-3 py-2 text-sm transition-all duration-[var(--motion-duration-fast)] ease-out",
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
                className="mt-5 min-h-[16rem] w-full resize-none rounded-[1.9rem] border border-surface-stroke-strong bg-surface-panel px-4 py-4 text-sm leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] outline-none transition-all duration-[var(--motion-duration-fast)] ease-out placeholder:text-muted-foreground focus:border-surface-stroke-strong focus:ring-2 focus:ring-surface-module-blue/35 sm:px-5 sm:py-5"
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

              {/* AI feedback for reflecting sessions */}
              {renderAiFeedbackSection()}
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
    </div>
  );

  function renderAiFeedbackSection() {
    const hasTranscript = transcriptDraft.trim().length > 0;

    if (!hasTranscript) {
      return (
        <div className="mt-6 border-t border-surface-stroke pt-5">
          <p className="text-sm font-medium text-foreground">
            Add a transcript to unlock AI-powered feedback.
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Type or paste a rough transcript above, then request AI feedback for clarity, grammar, and delivery notes.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-6 border-t border-surface-stroke pt-5 space-y-4">
        <p className="text-sm font-medium text-foreground">
          Transcript ready for AI review
        </p>
        <p className="text-xs leading-5 text-muted-foreground">
          {getTranscriptWordCount()} words{" "}
          {workspace.reflectionLabel
            ? `· ${workspace.reflectionLabel}`
            : ""}
        </p>

        {/* AI Feedback Button */}
        {!workspace.aiFeedback && !workspace.aiFeedbackLoading ? (
          <button
            type="button"
            onClick={() => void handleRequestAiFeedback()}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            <Sparkles className="mr-2 size-4" />
            Get AI feedback
          </button>
        ) : null}

        {/* AI Loading */}
        {workspace.aiFeedbackLoading ? (
          <div className="flex items-center gap-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel p-4">
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Analyzing your speaking...</p>
          </div>
        ) : null}

        {/* AI Error */}
        {workspace.aiFeedbackError && !workspace.aiFeedbackLoading ? (
          <p className="text-sm text-muted-foreground">{workspace.aiFeedbackError}</p>
        ) : null}

        {/* AI Feedback Content */}
        {workspace.aiFeedback ? (
          <div className="space-y-4">
            <InsetPanel className="p-4">
              <p className="text-sm leading-6 text-foreground">
                {workspace.aiFeedback.overallSummary}
              </p>
            </InsetPanel>

            <div className="grid gap-3 sm:grid-cols-2">
              {workspace.aiFeedback.clarityFeedback ? (
                <InsetPanel className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Clarity
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {workspace.aiFeedback.clarityFeedback}
                  </p>
                </InsetPanel>
              ) : null}

              {workspace.aiFeedback.grammarFeedback ? (
                <InsetPanel tone="lavender" className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Grammar
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {workspace.aiFeedback.grammarFeedback}
                  </p>
                </InsetPanel>
              ) : null}

              {workspace.aiFeedback.vocabularyFeedback ? (
                <InsetPanel tone="blue" className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Vocabulary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {workspace.aiFeedback.vocabularyFeedback}
                  </p>
                </InsetPanel>
              ) : null}

              {workspace.aiFeedback.fluencyFeedback ? (
                <InsetPanel tone="green" className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Fluency
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {workspace.aiFeedback.fluencyFeedback}
                  </p>
                </InsetPanel>
              ) : null}
            </div>

            {workspace.aiFeedback.confidenceNote ? (
              <InsetPanel className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Confidence
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {workspace.aiFeedback.confidenceNote}
                </p>
              </InsetPanel>
            ) : null}

            {workspace.aiFeedback.detectedPatterns?.length > 0 ? (
              <div className="grid gap-3">
                {workspace.aiFeedback.detectedPatterns.map((pattern) => (
                  <InsetPanel key={pattern.label} className="p-4">
                    <SmallTag>{pattern.label}</SmallTag>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {pattern.detail}
                    </p>
                  </InsetPanel>
                ))}
              </div>
            ) : null}

            {workspace.aiFeedback.strongerResponseExample ? (
              <InsetPanel tone="green" className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Stronger response example
                </p>
                <p className="mt-3 rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel px-4 py-3 text-sm leading-7 text-foreground">
                  {workspace.aiFeedback.strongerResponseExample}
                </p>
              </InsetPanel>
            ) : null}

            {workspace.aiFeedback.nextPracticeFocus ? (
              <InsetPanel className="p-4">
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
      </div>
    );
  }

  function getTranscriptWordCount() {
    return transcriptDraft.trim().split(/\s+/).filter(Boolean).length;
  }
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
  icon: typeof Mic;
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

function formatSpeakingMeta(
  prompt: ReturnType<typeof useSpeakingWorkspace>["activePrompt"] | undefined | null,
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

  return filteredParts.length > 0 ? filteredParts.join(" / ") : null;
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


