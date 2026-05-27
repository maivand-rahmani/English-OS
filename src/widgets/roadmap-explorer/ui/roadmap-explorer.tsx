"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpenText,
  CheckCircle2,
  CircleSlash,
  Flag,
  Layers3,
  Map,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import type { DashboardBlock, DashboardStage } from "@/entities/dashboard";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  InsetPanel,
  InfoTile,
  SectionEyebrow,
  SmallTag,
  SummaryBadge,
  type SurfaceTone,
} from "@/shared/ui/surfaces";
import type { ProgressEntry } from "@/shared/types";

import { useRoadmapExplorer } from "../model/use-roadmap-explorer";
import type { RoadmapExplorerProps } from "../model/roadmap-explorer-types";

const stageTones: SurfaceTone[] = ["lavender", "blue", "cream", "pink", "green"];

export function RoadmapExplorer(props: RoadmapExplorerProps) {
  const roadmap = useRoadmapExplorer(props);

  const reduced = useReducedMotion();
  const Wrapper = (reduced ? "section" : motion.section) as any;

  if (roadmap.allBlocks.length === 0) {
    return (
      <Wrapper
        className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1fr)_20rem]"
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
            })}
      >
        <DashboardCard className="bg-surface-gradient-empty p-6 sm:p-7">
          <SectionEyebrow icon={Map}>Roadmap</SectionEyebrow>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Your structured learning path
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Stage progression, actionable blocks, and direct links into the
            right resources for your current goal.
          </p>
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionEyebrow icon={Target}>What this section covers</SectionEyebrow>
          <div className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Visible stage progression</p>
            <p>Actionable roadmap blocks</p>
            <p>Direct links into the curated resource library</p>
          </div>
        </DashboardCard>
      </Wrapper>
    );
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
      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.35fr)_20rem]">
        <DashboardCard tone="lavender" className="overflow-hidden p-6 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <SectionEyebrow icon={Map}>Strategic path</SectionEyebrow>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.4rem]">
                {props.content.templateTitle}
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {props.content.templateDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <SmallTag>{props.content.learnerLevelLabel}</SmallTag>
                <SmallTag>{props.content.audienceLabel}</SmallTag>
                <SmallTag>{props.content.estimatedWeeks ?? "Flexible"} week path</SmallTag>
              </div>
            </div>

            {roadmap.nextBlock ? (
              <InsetPanel tone="cream" className="p-4 lg:max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Main roadmap action
                </p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {roadmap.nextBlock.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {roadmap.nextBlock.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`#block-${roadmap.nextBlock.id}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Jump to next block
                  </Link>
                  {roadmap.nextBlock.resources[0] ? (
                    <Link
                      href={`/resources#resource-${roadmap.nextBlock.resources[0].id}`}
                      className={buttonVariants({ size: "sm", variant: "outline" })}
                    >
                      Open linked resource
                    </Link>
                  ) : null}
                </div>
              </InsetPanel>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <SummaryBadge
              label="Roadmap progress"
              value={`${roadmap.roadmapCompletion}% complete`}
              accent="neutral"
            />
            <SummaryBadge
              label="Active stage"
              value={roadmap.activeStage?.title ?? "Choose your first stage"}
              accent="pink"
            />
            <SummaryBadge
              label="Blocks completed"
              value={`${roadmap.completedBlocks} of ${props.content.blockCount}`}
              accent="blue"
            />
            <SummaryBadge
              label="Guidance promise"
              value={props.content.goalLabel}
              accent="neutral"
            />
          </div>
        </DashboardCard>

        <DashboardCard tone="cream" className="p-5">
          <SectionEyebrow icon={Sparkles}>Roadmap lens</SectionEyebrow>
          <div className="mt-5 space-y-4">
            <InfoTile label="Stages" value={String(props.content.stageCount)} />
            <InfoTile label="Blocks" value={String(props.content.blockCount)} />
            <InfoTile
              label="Linked resources"
              value={String(props.content.resourceCount)}
            />
            <InfoTile
              label="Page promise"
              value="Direction first, action second."
            />
          </div>

          <InsetPanel tone="default" className="mt-5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Progress states
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StateTag state="not_started" />
              <StateTag state="in_progress" />
              <StateTag state="completed" />
              <StateTag state="needs_review" />
              <StateTag state="skipped_for_now" />
            </div>
          </InsetPanel>
        </DashboardCard>
      </div>

      <div className="grid gap-[var(--layout-gap)]">
        {roadmap.stages.map((stage, index) => {
          const completed = stage.blocks.filter(
            (block) => getEntryState(roadmap.progressById.get(block.id)) === "completed",
          ).length;
          const percent = stage.blocks.length
            ? Math.round((completed / stage.blocks.length) * 100)
            : 0;
          const stageTone = stageTones[index % stageTones.length];

          return (
            <DashboardCard key={stage.id} tone={stageTone} className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <SectionEyebrow icon={Layers3}>
                    Stage {index + 1} of {roadmap.stages.length}
                  </SectionEyebrow>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                    {stage.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {stage.summary}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[26rem]">
                  <InfoTile label="Stage type" value={capitalize(stage.stageTypeLabel)} />
                  <InfoTile
                    label="Estimated pace"
                    value={
                      stage.estimatedWeeks ? `${stage.estimatedWeeks} weeks` : "Flexible"
                    }
                  />
                  <InfoTile label="Stage progress" value={`${percent}% complete`} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--progress-track)]">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-6 grid gap-4">
                {stage.blocks.map((block) => (
                  <RoadmapBlockCard
                    key={block.id}
                    block={block}
                    busyAction={roadmap.busyAction}
                    entry={roadmap.progressById.get(block.id)}
                    stage={stage}
                    onComplete={() =>
                      roadmap.updateBlockState(
                        toBlockTarget(block),
                        "completed",
                        "complete",
                      )
                    }
                    onReview={() =>
                      roadmap.updateBlockState(
                        toBlockTarget(block),
                        "needs_review",
                        "review",
                      )
                    }
                    onSkip={() =>
                      roadmap.updateBlockState(
                        toBlockTarget(block),
                        "skipped_for_now",
                        "skip",
                      )
                    }
                    onStart={() =>
                      roadmap.updateBlockState(
                        toBlockTarget(block),
                        "in_progress",
                        "start",
                      )
                    }
                  />
                ))}
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </Wrapper>
  );
}

type RoadmapBlockCardProps = {
  block: DashboardBlock;
  busyAction: string | null;
  entry: ProgressEntry | undefined;
  stage: DashboardStage;
  onComplete: () => Promise<void>;
  onReview: () => Promise<void>;
  onSkip: () => Promise<void>;
  onStart: () => Promise<void>;
};

function RoadmapBlockCard({
  block,
  busyAction,
  entry,
  stage,
  onComplete,
  onReview,
  onSkip,
  onStart,
}: RoadmapBlockCardProps) {
  const state = getEntryState(entry);
  const isBusy = busyAction?.startsWith(`block:${block.id}:`) ?? false;

  return (
    <article
      id={`block-${block.id}`}
      className={cn(
        "rounded-[1.6rem] border border-surface-stroke-strong bg-surface-panel-muted p-4 shadow-panel transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5",
        state === "in_progress" &&
          "border-state-progress-border bg-surface-state-progress",
        state === "completed" &&
          "border-state-complete-border bg-surface-state-complete",
        state === "needs_review" &&
          "border-state-review-border bg-surface-state-review",
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <SmallTag>{capitalize(block.blockTypeLabel)}</SmallTag>
            {block.cefrLabel ? <SmallTag>{block.cefrLabel}</SmallTag> : null}
            <SmallTag>{formatMinutes(block.estimatedMinutes)}</SmallTag>
            {block.recommendedSessionCount ? (
              <SmallTag>{block.recommendedSessionCount} sessions</SmallTag>
            ) : null}
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            {block.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{block.summary}</p>
        </div>

        <StateTag state={state} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <InsetPanel tone="cream" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Purpose
          </p>
          <p className="mt-3 text-sm leading-7 text-foreground">{block.purpose}</p>
        </InsetPanel>
        <InsetPanel tone="default" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Why now
          </p>
          <p className="mt-3 text-sm leading-7 text-foreground">{block.whyNow}</p>
        </InsetPanel>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SmallTag>{stage.title}</SmallTag>
        {block.skills.map((skill) => (
          <SmallTag key={`${block.id}:${skill.slug}`}>
            {skill.title}
            {skill.emphasis === "primary" ? " core" : ""}
          </SmallTag>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.9fr)]">
        <InsetPanel tone="blue" className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpenText className="size-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
              Linked resources
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            {block.resources.map((resource) => (
              <Link
                key={resource.id}
                href={`/resources#resource-${resource.id}`}
                className="rounded-[1.15rem] border border-surface-stroke bg-surface-panel-strong px-4 py-3 shadow-panel transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap gap-2">
                  <SmallTag>{resource.role}</SmallTag>
                  <SmallTag>{capitalize(resource.resourceTypeLabel)}</SmallTag>
                  <SmallTag>{resource.sourceName}</SmallTag>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {resource.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {resource.note ?? resource.whyRecommended}
                </p>
              </Link>
            ))}
          </div>
        </InsetPanel>

        <InsetPanel tone="green" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Related output
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-foreground">
            <p>{block.writingTasks.length} writing task(s) linked to this block.</p>
            <p>{block.speakingPrompts.length} speaking prompt(s) linked to this block.</p>
            <p>
              Move from the roadmap into resources, writing, or speaking without
              losing the bigger learning direction.
            </p>
          </div>
        </InsetPanel>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled={isBusy} size="sm" onClick={() => void onStart()}>
          <Play className="size-4" />
          {state === "in_progress" ? "Resume block" : "Start block"}
        </Button>
        <Button
          disabled={isBusy}
          size="sm"
          variant="secondary"
          onClick={() => void onComplete()}
        >
          <CheckCircle2 className="size-4" />
          Complete
        </Button>
        <Button
          disabled={isBusy}
          size="sm"
          variant="outline"
          onClick={() => void onReview()}
        >
          <Flag className="size-4" />
          Needs review
        </Button>
        <Button
          disabled={isBusy}
          size="sm"
          variant="ghost"
          onClick={() => void onSkip()}
        >
          <CircleSlash className="size-4" />
          Skip for now
        </Button>
      </div>
    </article>
  );
}

function StateTag({ state }: { state: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        state === "not_started" &&
          "border-surface-stroke bg-surface-pill text-muted-foreground",
        state === "in_progress" &&
          "border-state-progress-border bg-surface-state-progress text-state-progress-text",
        state === "completed" &&
          "border-state-complete-border bg-surface-state-complete text-state-complete-text",
        state === "needs_review" &&
          "border-state-review-border bg-surface-state-review text-state-review-text",
        state === "skipped_for_now" &&
          "border-state-skipped-border bg-surface-state-skipped text-state-skipped-text",
      )}
    >
      {humanizeState(state)}
    </span>
  );
}

function getEntryState(entry: ProgressEntry | undefined) {
  return entry?.state ?? "not_started";
}

function humanizeState(state: string) {
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

function capitalize(value: string) {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}

function toBlockTarget(block: DashboardBlock) {
  return {
    id: block.id,
    title: block.title,
    stageId: block.stageId,
    stageTitle: block.stageTitle,
  };
}
