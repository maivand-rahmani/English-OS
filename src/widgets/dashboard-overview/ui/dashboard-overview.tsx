"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpenText,
  Clock3,
  Mic,
  PenSquare,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type {
  DashboardBlock,
  DashboardContentState,
  DashboardResource,
  DashboardSkill,
  DashboardSpeakingPrompt,
  DashboardWritingTask,
} from "@/entities/dashboard";
import { useDrafts } from "@/shared/hooks/use-drafts";
import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { useLocalProgress } from "@/shared/hooks/use-local-progress";
import { cn } from "@/shared/lib/utils";
import {
  LearningEventType,
  type BlockState,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";

type DashboardOverviewProps = {
  content: DashboardContentState;
};

type ResourceWithContext = DashboardResource & {
  blockId: string;
  blockTitle: string;
  stageTitle: string;
  stageTypeLabel: string;
  blockSkills: DashboardSkill[];
};

type WritingTaskWithContext = DashboardWritingTask & {
  blockId: string;
  stageTitle: string;
};

type SpeakingPromptWithContext = DashboardSpeakingPrompt & {
  blockId: string;
  stageTitle: string;
};

type ReviewPreviewItem = {
  id: string;
  label: string;
  context: string;
  urgency: string;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  when: string;
};

export function DashboardOverview({ content }: DashboardOverviewProps) {
  const { entries, isLoading: progressLoading, updateEntry } = useLocalProgress();
  const { events, isLoading: eventsLoading, recordEvent } = useLearningEvents(8);
  const { drafts, isLoading: draftsLoading, createDraft } = useDrafts();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  const allBlocks = content.stages.flatMap((stage) => stage.blocks);
  const blockProgressEntries = entries.filter((entry) => entry.entryType === "block");
  const resourceProgressEntries = entries.filter(
    (entry) => entry.entryType === "resource",
  );
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const blockById = new Map(allBlocks.map((block) => [block.id, block]));

  const resources = allBlocks.flatMap((block) =>
    block.resources.map((resource) => ({
      ...resource,
      blockId: block.id,
      blockTitle: block.title,
      stageTitle: block.stageTitle,
      stageTypeLabel: block.stageTypeLabel,
      blockSkills: block.skills,
    })),
  );
  const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

  const writingTasks = allBlocks.flatMap((block) =>
    block.writingTasks.map((task) => ({
      ...task,
      blockId: block.id,
      stageTitle: block.stageTitle,
    })),
  );
  const speakingPrompts = allBlocks.flatMap((block) =>
    block.speakingPrompts.map((prompt) => ({
      ...prompt,
      blockId: block.id,
      stageTitle: block.stageTitle,
    })),
  );

  const localStateLoading = progressLoading || eventsLoading || draftsLoading;
  const focusBlock = getFocusBlock(allBlocks, progressById);
  const focusBlockState = focusBlock
    ? getEntryState(progressById.get(focusBlock.id))
    : "not_started";
  const focusResource = focusBlock
    ? pickFocusResource(
        focusBlock.resources.map((resource) => ({
          ...resource,
          blockId: focusBlock.id,
          blockTitle: focusBlock.title,
          stageTitle: focusBlock.stageTitle,
          stageTypeLabel: focusBlock.stageTypeLabel,
          blockSkills: focusBlock.skills,
        })),
        progressById,
      )
    : null;
  const reviewPreviewItems = getReviewPreviewItems(
    entries,
    events,
    blockById,
    resourceById,
  );
  const recentActivity = getRecentActivity(events, blockById, resourceById);
  const completedBlocks = allBlocks.filter(
    (block) => getEntryState(progressById.get(block.id)) === "completed",
  ).length;
  const roadmapCompletion = allBlocks.length
    ? Math.round((completedBlocks / allBlocks.length) * 100)
    : 0;
  const activeDaysThisWeek = countActiveDays(events, 7);
  const consistencyLabel = getConsistencyLabel(activeDaysThisWeek);
  const strongestSkill = getStrongestSkill(allBlocks, resources, entries);
  const weakestSkill = getWeakestSkill(allBlocks, resources, entries, events);
  const nextWritingTask = pickOutputTask(writingTasks, focusBlock?.id);
  const nextSpeakingPrompt = pickOutputPrompt(speakingPrompts, focusBlock?.id);
  const draftForWritingTask = nextWritingTask
    ? drafts.find((draft) => draft.taskId === nextWritingTask.id)
    : undefined;
  const outputFocus = pickTodayOutput(
    nextWritingTask,
    nextSpeakingPrompt,
    drafts.length > 0,
    events,
  );
  const totalPlanMinutes =
    (focusBlock?.estimatedMinutes ?? 0) +
    (reviewPreviewItems.length > 0 ? Math.min(15, reviewPreviewItems.length * 5) : 0) +
    (outputFocus?.estimatedMinutes ?? 0);
  const reviewHeadline =
    reviewPreviewItems.length > 0
      ? `${reviewPreviewItems.length} item${
          reviewPreviewItems.length === 1 ? "" : "s"
        } need attention`
      : "No urgent review yet";
  const planHeadline = focusBlock
    ? `Keep moving through ${focusBlock.stageTitle.toLowerCase()}.`
    : "Curated content will land here once the roadmap is available.";

  async function handleBlockStateChange(
    block: DashboardBlock,
    nextState: BlockState,
    action: "start" | "complete" | "review",
  ) {
    setBusyAction(`block:${block.id}:${action}`);

    try {
      await updateEntry(
        block.id,
        nextState,
        {
          label: block.title,
          stageTitle: block.stageTitle,
        },
        "block",
      );

      if (action === "start") {
        await recordEvent({
          type: LearningEventType.BlockStarted,
          payload: {
            blockId: block.id,
            blockLabel: block.title,
            stageId: block.stageId,
          },
        });
      }

      if (action === "complete") {
        await recordEvent({
          type: LearningEventType.BlockCompleted,
          payload: {
            blockId: block.id,
            blockLabel: block.title,
            stageId: block.stageId,
          },
        });
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function handleResourceStateChange(
    resource: ResourceWithContext,
    nextState: BlockState,
    action: "start" | "complete" | "difficult",
  ) {
    setBusyAction(`resource:${resource.id}:${action}`);

    try {
      await updateEntry(
        resource.id,
        nextState,
        {
          label: resource.title,
          blockTitle: resource.blockTitle,
        },
        "resource",
      );

      if (action === "start") {
        await recordEvent({
          type: LearningEventType.ResourceStarted,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
          },
        });
      }

      if (action === "complete") {
        await recordEvent({
          type: LearningEventType.ResourceCompleted,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
            reflection: "useful",
          },
        });
      }

      if (action === "difficult") {
        await recordEvent({
          type: LearningEventType.ResourceMarkedDifficult,
          payload: {
            resourceId: resource.id,
            resourceTitle: resource.title,
            reason: `Needs another pass for ${resource.blockTitle.toLowerCase()}.`,
          },
        });
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateDraft(task: WritingTaskWithContext) {
    setBusyAction(`draft:${task.id}`);
    setDraftNotice(null);

    try {
      await createDraft(task.title, "", task.id);
      setDraftNotice(`Local draft stub created for “${task.title}”.`);
    } catch {
      setDraftNotice("Draft creation failed. Try again from the writing workspace.");
    } finally {
      setBusyAction(null);
    }
  }

  if (allBlocks.length === 0) {
    return (
      <section className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.2fr)_20rem]">
        <DashboardCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,244,255,0.92))] p-6 sm:p-7">
          <SectionEyebrow icon={Sparkles}>Dashboard reset</SectionEyebrow>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Curated content is not loaded yet.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Once a roadmap template is available, this screen will surface the
            next block, best support resource, review pressure, and output
            actions from one calm control center.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/roadmap" className={buttonVariants({ size: "lg" })}>
              Open roadmap
            </Link>
            <Link
              href="/resources"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Open resources
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionEyebrow icon={Target}>What this page will answer</SectionEyebrow>
          <ul className="mt-5 grid gap-3">
            {[
              "What should I do today?",
              "What needs review right now?",
              "Where am I making progress?",
              "What is the best next resource?",
            ].map((item) => (
              <li
                key={item}
                className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </DashboardCard>
      </section>
    );
  }

  return (
    <section className="space-y-[var(--layout-gap)]">
      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.35fr)_20rem]">
        <DashboardCard className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,243,255,0.94))] p-6 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,211,226,0.42),transparent_60%),radial-gradient(circle_at_top_right,rgba(189,205,255,0.34),transparent_55%)]" />
          <div className="relative">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                <SectionEyebrow icon={Sparkles}>Today plan</SectionEyebrow>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {focusBlock?.title ?? "Your next block will appear here."}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {planHeadline}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[20rem] xl:grid-cols-1">
                <InfoTile
                  label="Current stage"
                  value={focusBlock?.stageTitle ?? content.templateTitle}
                />
                <InfoTile label="Estimated time" value={formatMinutes(totalPlanMinutes)} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-4">
              <SummaryBadge
                label="Level"
                value={content.learnerLevelLabel}
                accent="neutral"
              />
              <SummaryBadge
                label="Goal"
                value={content.goalLabel}
                accent="rose"
              />
              <SummaryBadge
                label="Current focus"
                value={focusBlock ? getSkillLine(focusBlock.skills) : "No focus yet"}
                accent="blue"
              />
              <SummaryBadge
                label="Roadmap state"
                value={humanizeState(focusBlockState)}
                accent="neutral"
              />
            </div>

            <div className="mt-8 grid gap-3">
              <PlanRow
                icon={Target}
                title="Main roadmap action"
                headline={focusBlock?.summary ?? "Pick up the next roadmap block."}
                meta={`${focusBlock?.stageTypeLabel ?? "roadmap"} · ${formatMinutes(
                  focusBlock?.estimatedMinutes,
                )}`}
                state={humanizeState(focusBlockState)}
              />
              <PlanRow
                icon={RotateCcw}
                title="Review focus"
                headline={reviewPreviewItems[0]?.label ?? "No urgent review has surfaced yet."}
                meta={
                  reviewPreviewItems[0]?.context ??
                  "Finish a block or flag friction to start shaping review."
                }
                state={reviewHeadline}
              />
              <PlanRow
                icon={outputFocus?.kind === "speaking" ? Mic : PenSquare}
                title="Output action"
                headline={outputFocus?.title ?? "Writing and speaking prompts will appear here."}
                meta={outputFocus?.detail ?? "Use one short output action to turn study into active English."}
                state={outputFocus?.status ?? "queued"}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {focusBlock ? (
                <button
                  type="button"
                  onClick={() =>
                    handleBlockStateChange(
                      focusBlock,
                      focusBlockState === "completed" ? "completed" : "in_progress",
                      "start",
                    )
                  }
                  disabled={busyAction === `block:${focusBlock.id}:start`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "justify-center rounded-full px-5",
                  )}
                >
                  {focusBlockState === "in_progress" ? "Resume block" : "Start block"}
                </button>
              ) : null}

              {focusBlock ? (
                <button
                  type="button"
                  onClick={() =>
                    handleBlockStateChange(focusBlock, "completed", "complete")
                  }
                  disabled={busyAction === `block:${focusBlock.id}:complete`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "justify-center rounded-full border-white/70 bg-white/80 px-5",
                  )}
                >
                  Mark block complete
                </button>
              ) : null}

              {focusBlock ? (
                <button
                  type="button"
                  onClick={() =>
                    handleBlockStateChange(focusBlock, "needs_review", "review")
                  }
                  disabled={busyAction === `block:${focusBlock.id}:review`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "ghost" }),
                    "justify-center rounded-full border border-transparent px-5 text-foreground hover:bg-black/5",
                  )}
                >
                  Mark for review
                </button>
              ) : null}
            </div>
          </div>
        </DashboardCard>

        <div className="space-y-[var(--layout-gap)]">
          <DashboardCard className="p-5">
            <SectionEyebrow icon={BookOpenText}>Best next resource</SectionEyebrow>
            {focusResource ? (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SmallTag>{focusResource.role}</SmallTag>
                  <SmallTag>{focusResource.resourceTypeLabel}</SmallTag>
                  <SmallTag>{formatMinutes(focusResource.estimatedMinutes)}</SmallTag>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {focusResource.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {focusResource.sourceName} · {focusResource.primaryUseCaseLabel}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {getResourceReason(
                    focusResource,
                    progressById.get(focusResource.id),
                    focusBlockState,
                  )}
                </p>

                <div className="mt-4 rounded-[1.25rem] border border-white/70 bg-[var(--surface-2)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Supports
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {focusResource.blockTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {focusResource.note ?? focusResource.bestUseCase}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleResourceStateChange(focusResource, "in_progress", "start")
                    }
                    disabled={busyAction === `resource:${focusResource.id}:start`}
                    className={cn(buttonVariants(), "rounded-full")}
                  >
                    Start resource
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleResourceStateChange(focusResource, "completed", "complete")
                    }
                    disabled={busyAction === `resource:${focusResource.id}:complete`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full border-white/70 bg-white/80",
                    )}
                  >
                    Mark useful and done
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleResourceStateChange(
                        focusResource,
                        "needs_review",
                        "difficult",
                      )
                    }
                    disabled={busyAction === `resource:${focusResource.id}:difficult`}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "rounded-full border border-transparent text-foreground hover:bg-black/5",
                    )}
                  >
                    Mark difficult
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                The current block does not have a linked resource yet.
              </p>
            )}
          </DashboardCard>

          <DashboardCard className="p-5">
            <SectionEyebrow icon={RotateCcw}>Review preview</SectionEyebrow>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {reviewPreviewItems.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{reviewHeadline}</p>
              </div>
              <Link
                href="/roadmap"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full px-3 text-foreground hover:bg-black/5",
                )}
              >
                Open roadmap
              </Link>
            </div>

            <div className="mt-4 grid gap-3">
              {reviewPreviewItems.length > 0 ? (
                reviewPreviewItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3"
                  >
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.context}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.urgency}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-black/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
                  Review pressure will appear here when you mark a block or
                  resource difficult, skip something, or explicitly set it to
                  needs review.
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,1fr)]">
        <DashboardCard className="p-5">
          <SectionEyebrow icon={TrendingUp}>Progress snapshot</SectionEyebrow>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-foreground">
                {roadmapCompletion}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {completedBlocks} of {content.blockCount} roadmap blocks completed
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Consistency
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {consistencyLabel}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/6">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]"
              style={{ width: `${roadmapCompletion}%` }}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MetricTile
              icon={Activity}
              label="Active days this week"
              value={`${activeDaysThisWeek}/7`}
              detail="Counted from your local learning events."
            />
            <MetricTile
              icon={Clock3}
              label="Curated path size"
              value={`${content.stageCount} stages`}
              detail={`${content.blockCount} blocks · ${content.resourceCount} linked resources`}
            />
            <MetricTile
              icon={TrendingUp}
              label="Strongest current area"
              value={strongestSkill ?? "Still emerging"}
              detail="Weighted more heavily toward completed and active blocks."
            />
            <MetricTile
              icon={TrendingDown}
              label="Current friction"
              value={weakestSkill ?? "No urgent weak area"}
              detail="Driven by needs-review and difficulty signals."
            />
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionEyebrow icon={Sparkles}>Writing and speaking</SectionEyebrow>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <QuickActionCard
              icon={PenSquare}
              title={nextWritingTask?.title ?? "Next writing task pending"}
              eyebrow="Writing"
              detail={
                draftForWritingTask
                  ? `1 local draft is waiting for ${nextWritingTask?.blockTitle.toLowerCase()}.`
                  : nextWritingTask?.summary ??
                    "A guided writing task will appear here when the current block links one."
              }
              footer={
                draftForWritingTask
                  ? `Draft updated ${formatRelativeTimestamp(draftForWritingTask.updatedAt)}`
                  : getWritingStatus(events, drafts.length)
              }
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/writing"
                  className={cn(buttonVariants(), "w-full rounded-full")}
                >
                  Open writing workspace
                </Link>
                {nextWritingTask && !draftForWritingTask ? (
                  <button
                    type="button"
                    onClick={() => handleCreateDraft(nextWritingTask)}
                    disabled={busyAction === `draft:${nextWritingTask.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full rounded-full border-white/70 bg-white/80",
                    )}
                  >
                    Create local draft stub
                  </button>
                ) : null}
              </div>
            </QuickActionCard>

            <QuickActionCard
              icon={Mic}
              title={nextSpeakingPrompt?.title ?? "Next speaking prompt pending"}
              eyebrow="Speaking"
              detail={
                nextSpeakingPrompt?.summary ??
                "A speaking prompt will appear here when the active block links one."
              }
              footer={getSpeakingStatus(events)}
            >
              <Link
                href="/speaking"
                className={cn(buttonVariants(), "w-full rounded-full")}
              >
                Open speaking workspace
              </Link>
            </QuickActionCard>
          </div>

          {draftNotice ? (
            <div className="mt-4 rounded-[1.1rem] border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              {draftNotice}
            </div>
          ) : null}
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionEyebrow icon={Activity}>Recent activity</SectionEyebrow>
          <div className="mt-5 grid gap-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.when}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-black/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
                Your local event feed will start filling after you begin a
                roadmap block, complete a resource, or submit practice.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Live local state</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {localStateLoading
                  ? "Syncing browser persistence…"
                  : `${blockProgressEntries.length} block entries · ${resourceProgressEntries.length} resource entries`}
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
};

function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <article
      className={cn(
        "relative rounded-[1.75rem] border border-white/70 bg-[var(--surface-1)] shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

type SectionEyebrowProps = {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
};

function SectionEyebrow({ children, icon: Icon }: SectionEyebrowProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </div>
  );
}

type SummaryBadgeProps = {
  label: string;
  value: string;
  accent: "neutral" | "rose" | "blue";
};

function SummaryBadge({ label, value, accent }: SummaryBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        accent === "neutral" && "border-white/70 bg-[var(--surface-2)]",
        accent === "rose" &&
          "border-rose-100/70 bg-[linear-gradient(180deg,rgba(255,242,247,0.92),rgba(255,250,252,0.86))]",
        accent === "blue" &&
          "border-sky-100/70 bg-[linear-gradient(180deg,rgba(241,248,255,0.92),rgba(250,252,255,0.9))]",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}

type PlanRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  headline: string;
  meta: string;
  state: string;
};

function PlanRow({ icon: Icon, title, headline, meta, state }: PlanRowProps) {
  return (
    <div className="grid gap-3 rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <div className="flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(17,17,20,0.18)]">
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
      </div>

      <div className="rounded-full border border-white/70 bg-[var(--surface-3)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
        {state}
      </div>
    </div>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
};

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

type MetricTileProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
};

function MetricTile({ icon: Icon, label, value, detail }: MetricTileProps) {
  return (
    <div className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-3 text-base font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

type QuickActionCardProps = {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  eyebrow: string;
  detail: string;
  footer: string;
};

function QuickActionCard({
  children,
  icon: Icon,
  title,
  eyebrow,
  detail,
  footer,
}: QuickActionCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(17,17,20,0.18)]">
          <Icon className="size-4.5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{detail}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {footer}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SmallTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/70 bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

function getFocusBlock(
  blocks: DashboardBlock[],
  progressById: Map<string, ProgressEntry>,
) {
  return (
    blocks.find((block) => {
      const state = getEntryState(progressById.get(block.id));
      return state !== "completed" && state !== "skipped_for_now";
    }) ?? blocks.at(-1) ?? null
  );
}

function pickFocusResource(
  resources: ResourceWithContext[],
  progressById: Map<string, ProgressEntry>,
) {
  if (resources.length === 0) {
    return null;
  }

  const activeResource = resources.find(
    (resource) => getEntryState(progressById.get(resource.id)) === "in_progress",
  );

  if (activeResource) {
    return activeResource;
  }

  const unfinishedCoreResource = resources.find((resource) => {
    const state = getEntryState(progressById.get(resource.id));
    return resource.role === "core" && state !== "completed";
  });

  return unfinishedCoreResource ?? resources[0];
}

function pickOutputTask(
  tasks: WritingTaskWithContext[],
  focusBlockId: string | undefined,
) {
  return tasks.find((task) => task.blockId === focusBlockId) ?? tasks[0] ?? null;
}

function pickOutputPrompt(
  prompts: SpeakingPromptWithContext[],
  focusBlockId: string | undefined,
) {
  return prompts.find((prompt) => prompt.blockId === focusBlockId) ?? prompts[0] ?? null;
}

function pickTodayOutput(
  writingTask: WritingTaskWithContext | null,
  speakingPrompt: SpeakingPromptWithContext | null,
  hasDrafts: boolean,
  events: LearningEvent[],
) {
  const lastWritingAt = getLatestEventTimestamp(events, LearningEventType.WritingSubmitted);
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );

  if (speakingPrompt && (!lastSpeakingAt || !isRecent(lastSpeakingAt, 5))) {
    return {
      kind: "speaking" as const,
      title: speakingPrompt.title,
      detail: `${speakingPrompt.blockTitle} · ${formatMinutes(
        speakingPrompt.estimatedMinutes,
      )}`,
      estimatedMinutes: speakingPrompt.estimatedMinutes ?? 10,
      status: "speaking warm-up",
    };
  }

  if (writingTask && (hasDrafts || !lastWritingAt || !isRecent(lastWritingAt, 5))) {
    return {
      kind: "writing" as const,
      title: writingTask.title,
      detail: `${writingTask.blockTitle} · ${formatMinutes(
        writingTask.estimatedMinutes,
      )}`,
      estimatedMinutes: writingTask.estimatedMinutes ?? 15,
      status: hasDrafts ? "resume draft" : "writing focus",
    };
  }

  if (speakingPrompt) {
    return {
      kind: "speaking" as const,
      title: speakingPrompt.title,
      detail: `${speakingPrompt.blockTitle} · ${formatMinutes(
        speakingPrompt.estimatedMinutes,
      )}`,
      estimatedMinutes: speakingPrompt.estimatedMinutes ?? 10,
      status: "speaking practice",
    };
  }

  if (writingTask) {
    return {
      kind: "writing" as const,
      title: writingTask.title,
      detail: `${writingTask.blockTitle} · ${formatMinutes(
        writingTask.estimatedMinutes,
      )}`,
      estimatedMinutes: writingTask.estimatedMinutes ?? 15,
      status: "writing focus",
    };
  }

  return null;
}

function getReviewPreviewItems(
  entries: ProgressEntry[],
  events: LearningEvent[],
  blockById: Map<string, DashboardBlock>,
  resourceById: Map<string, ResourceWithContext>,
) {
  const deduped = new Map<string, ReviewPreviewItem>();

  for (const entry of entries) {
    if (entry.state !== "needs_review") {
      continue;
    }

    if (entry.entryType === "block") {
      const block = blockById.get(entry.id);
      if (!block) {
        continue;
      }

      deduped.set(`block:${block.id}`, {
        id: `block:${block.id}`,
        label: block.title,
        context: `${block.stageTitle} · ${getSkillLine(block.skills)}`,
        urgency: "needs review",
      });
    }

    if (entry.entryType === "resource") {
      const resource = resourceById.get(entry.id);
      if (!resource) {
        continue;
      }

      deduped.set(`resource:${resource.id}`, {
        id: `resource:${resource.id}`,
        label: resource.title,
        context: `${resource.blockTitle} · ${resource.sourceName}`,
        urgency: "needs review",
      });
    }
  }

  for (const event of events) {
    if (event.type === LearningEventType.ResourceMarkedDifficult) {
      const resource = resourceById.get(event.payload.resourceId);
      if (!resource) {
        continue;
      }

      deduped.set(`resource:${resource.id}:difficult`, {
        id: `resource:${resource.id}:difficult`,
        label: resource.title,
        context: `${resource.blockTitle} · marked difficult`,
        urgency: "marked difficult",
      });
    }
  }

  return [...deduped.values()].slice(0, 4);
}

function getRecentActivity(
  events: LearningEvent[],
  blockById: Map<string, DashboardBlock>,
  resourceById: Map<string, ResourceWithContext>,
) {
  const items: ActivityItem[] = [];

  for (const event of events) {
    if (event.type === LearningEventType.BlockStarted) {
      const block = blockById.get(event.payload.blockId);
      items.push({
        id: event.id,
        title: `Started ${event.payload.blockLabel}`,
        detail:
          block?.stageTitle ??
          "Local block activity is now shaping your dashboard.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.BlockCompleted) {
      const block = blockById.get(event.payload.blockId);
      items.push({
        id: event.id,
        title: `Completed ${event.payload.blockLabel}`,
        detail:
          block?.summary ?? "This block is now counted inside roadmap progress.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceStarted) {
      const resource = resourceById.get(event.payload.resourceId);
      items.push({
        id: event.id,
        title: `Started ${event.payload.resourceTitle}`,
        detail:
          resource?.blockTitle ??
          "A support resource is now part of your current path.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceCompleted) {
      const resource = resourceById.get(event.payload.resourceId);
      items.push({
        id: event.id,
        title: `Completed ${event.payload.resourceTitle}`,
        detail:
          resource?.followUpHint ??
          "Use the follow-up hint or move into the next task while the material is fresh.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.ResourceMarkedDifficult) {
      items.push({
        id: event.id,
        title: `Flagged difficulty on ${event.payload.resourceTitle}`,
        detail:
          event.payload.reason ?? "This item will now appear in review preview.",
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.WritingSubmitted) {
      items.push({
        id: event.id,
        title: "Submitted a writing attempt",
        detail: `${event.payload.wordCount} words recorded locally.`,
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }

    if (event.type === LearningEventType.SpeakingRecorded) {
      items.push({
        id: event.id,
        title: "Recorded a speaking session",
        detail: `${Math.round(event.payload.durationSeconds / 60)} min speaking warm-up.`,
        when: formatRelativeTimestamp(event.timestamp),
      });
      continue;
    }
  }

  return items.slice(0, 5);
}

function countActiveDays(events: LearningEvent[], days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const uniqueDays = new Set(
    events
      .filter((event) => event.timestamp >= cutoff)
      .map((event) => new Date(event.timestamp).toDateString()),
  );

  return uniqueDays.size;
}

function getConsistencyLabel(activeDays: number) {
  if (activeDays >= 5) {
    return "Strong return rhythm";
  }

  if (activeDays >= 3) {
    return "Steady momentum";
  }

  if (activeDays >= 1) {
    return "Momentum is forming";
  }

  return "No recent rhythm yet";
}

function getStrongestSkill(
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
  entries: ProgressEntry[],
) {
  const scores = new Map<string, { title: string; progress: number }>();
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));

  for (const block of blocks) {
    const state = getEntryState(progressById.get(block.id));
    for (const skill of block.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, progress: 0 };
      const weight = skill.emphasis === "primary" ? 3 : 1.5;

      if (state === "completed") {
        current.progress += weight;
      } else if (state === "in_progress") {
        current.progress += weight / 1.5;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const resource of resources) {
    const state = getEntryState(progressById.get(resource.id));
    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, progress: 0 };
      const weight = skill.emphasis === "primary" ? 1.5 : 0.75;

      if (state === "completed") {
        current.progress += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  return [...scores.values()].sort((left, right) => right.progress - left.progress)[0]
    ?.title;
}

function getWeakestSkill(
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
  entries: ProgressEntry[],
  events: LearningEvent[],
) {
  const scores = new Map<string, { title: string; friction: number }>();
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

  for (const block of blocks) {
    const state = getEntryState(progressById.get(block.id));
    for (const skill of block.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      const weight = skill.emphasis === "primary" ? 2 : 1;

      if (state === "needs_review" || state === "skipped_for_now") {
        current.friction += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const resource of resources) {
    const state = getEntryState(progressById.get(resource.id));
    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      const weight = skill.emphasis === "primary" ? 1.75 : 0.75;

      if (state === "needs_review") {
        current.friction += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const event of events) {
    if (event.type !== LearningEventType.ResourceMarkedDifficult) {
      continue;
    }

    const resource = resourceById.get(event.payload.resourceId);
    if (!resource) {
      continue;
    }

    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      current.friction += skill.emphasis === "primary" ? 1.5 : 0.75;
      scores.set(skill.slug, current);
    }
  }

  return [...scores.values()].sort((left, right) => right.friction - left.friction)[0]
    ?.friction
    ? [...scores.values()].sort((left, right) => right.friction - left.friction)[0].title
    : null;
}

function getResourceReason(
  resource: ResourceWithContext,
  entry: ProgressEntry | undefined,
  blockState: BlockState,
) {
  const resourceState = getEntryState(entry);

  if (resourceState === "needs_review") {
    return `Recommended because you already marked this resource shaky for ${resource.blockTitle.toLowerCase()}.`;
  }

  if (resourceState === "in_progress") {
    return `Recommended because it is already part of your active work inside ${resource.blockTitle.toLowerCase()}.`;
  }

  if (blockState === "not_started" && resource.role === "core") {
    return `Recommended because it is the core support resource for your current block and helps you start cleanly.`;
  }

  return resource.note ?? resource.whyRecommended;
}

function getWritingStatus(events: LearningEvent[], draftCount: number) {
  if (draftCount > 0) {
    return `${draftCount} local draft${draftCount === 1 ? "" : "s"} waiting`;
  }

  const lastWritingAt = getLatestEventTimestamp(events, LearningEventType.WritingSubmitted);

  if (!lastWritingAt) {
    return "No writing submitted yet";
  }

  return isRecent(lastWritingAt, 5)
    ? "Writing momentum is still warm"
    : "Writing has been quiet recently";
}

function getSpeakingStatus(events: LearningEvent[]) {
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );

  if (!lastSpeakingAt) {
    return "No speaking session recorded yet";
  }

  return isRecent(lastSpeakingAt, 5)
    ? "Speaking practice is active"
    : "Speaking needs another return";
}

function getLatestEventTimestamp(
  events: LearningEvent[],
  type: LearningEvent["type"],
) {
  return events.find((event) => event.type === type)?.timestamp ?? null;
}

function getEntryState(entry: ProgressEntry | undefined): BlockState {
  return entry?.state ?? "not_started";
}

function getSkillLine(skills: DashboardSkill[]) {
  if (skills.length === 0) {
    return "No skill links yet";
  }

  return skills
    .slice()
    .sort((left, right) =>
      left.emphasis === right.emphasis
        ? 0
        : left.emphasis === "primary"
          ? -1
          : 1,
    )
    .map((skill) => skill.title)
    .join(" · ");
}

function humanizeState(state: BlockState) {
  switch (state) {
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "needs_review":
      return "Needs review";
    case "skipped_for_now":
      return "Skipped for now";
    default:
      return "Not started";
  }
}

function formatMinutes(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) {
    return "Flexible time";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatRelativeTimestamp(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(timestamp);
}

function isRecent(timestamp: number, days: number) {
  return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000;
}
