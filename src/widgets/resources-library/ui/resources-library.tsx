"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  CheckCircle2,
  CircleSlash,
  Filter,
  Flag,
  LibraryBig,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import { buttonVariants, Button } from "@/shared/ui/button";
import {
  DashboardCard,
  InsetPanel,
  InfoTile,
  SectionEyebrow,
  SmallTag,
  SummaryBadge,
} from "@/shared/ui/surfaces";
import { MobileSheet } from "@/shared/ui/mobile-sheet";
import { cn } from "@/shared/lib/utils";
import type { ProgressEntry } from "@/shared/types";

import { useResourcesLibrary } from "../model/use-resources-library";
import type { RoadmapExplorerProps } from "../../roadmap-explorer/model/roadmap-explorer-types";

type LibraryResourceCard = ReturnType<typeof useResourcesLibrary>["resources"][number];

export function ResourcesLibrary({ content }: RoadmapExplorerProps) {
  const library = useResourcesLibrary(content);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;
  const activeFilterCount = getActiveFilterCount([
    library.skillFilter,
    library.formatFilter,
    library.useCaseFilter,
    library.stateFilter,
  ]);

  function resetFilters() {
    library.setSkillFilter("all");
    library.setFormatFilter("all");
    library.setUseCaseFilter("all");
    library.setStateFilter("all");
  }

  if (library.resources.length === 0) {
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
          <SectionEyebrow icon={LibraryBig}>Resource library</SectionEyebrow>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Your curated resource library
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Stop searching, start learning. Every resource is chosen and
            explained in the context of your roadmap.
          </p>
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionEyebrow icon={Target}>What this section answers</SectionEyebrow>
          <div className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>What is worth using now</p>
            <p>Why it fits the learner&apos;s path</p>
            <p>What to do after each resource</p>
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
        <DashboardCard tone="blue" className="overflow-hidden p-6 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <SectionEyebrow icon={LibraryBig}>Curated library</SectionEyebrow>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.4rem]">
                Resources with context, not random links
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Each resource is wrapped with skill fit, explanation, and follow-up
                guidance so the learner can trust why it appears now.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <SmallTag>{content.learnerLevelLabel}</SmallTag>
                <SmallTag>{content.audienceLabel}</SmallTag>
                <SmallTag>{library.resources.length} curated picks</SmallTag>
              </div>
            </div>

            {library.activeResource ? (
              <InsetPanel tone="cream" className="p-4 lg:max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Active resource
                </p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {library.activeResource.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {library.activeResource.note ?? library.activeResource.whyRecommended}
                </p>
                <div className="mobile-stacked-actions mt-4">
                  <a
                    className={buttonVariants({ size: "sm" })}
                    href={library.activeResource.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Visit resource
                  </a>
                  <Link
                    href={`#resource-${library.activeResource.id}`}
                    className={buttonVariants({ size: "sm", variant: "outline" })}
                  >
                    Open details
                  </Link>
                </div>
              </InsetPanel>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <SummaryBadge
              label="Featured"
              value={`${library.featuredCount} editorial picks`}
              accent="neutral"
            />
            <SummaryBadge
              label="Completed"
              value={`${library.completedCount} tracked locally`}
              accent="blue"
            />
            <SummaryBadge
              label="Filtered view"
              value={`${library.filteredResources.length} resources visible`}
              accent="pink"
            />
            <SummaryBadge
              label="Curation rule"
              value="Explain first, filter second."
              accent="neutral"
            />
          </div>
        </DashboardCard>

        <DashboardCard tone="cream" className="p-5">
          <SectionEyebrow icon={Sparkles}>Library status</SectionEyebrow>
          <div className="mt-5 space-y-4">
            <InfoTile label="Resource count" value={String(library.resources.length)} />
            <InfoTile label="Featured picks" value={`${library.featuredCount} highlighted`} />
            <InfoTile
              label="Progress state"
              value={library.isLoading ? "Updating progress" : "Ready to use"}
            />
            <InfoTile label="Navigation" value="Roadmap links land directly here." />
          </div>
        </DashboardCard>
      </div>

      <div className="lg:hidden">
        <DashboardCard className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionEyebrow icon={Filter}>Filters</SectionEyebrow>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {activeFilterCount === 0
                  ? "All curated resources are visible."
                  : `${activeFilterCount} filter groups are active right now.`}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsFiltersSheetOpen(true)}>
              Filters
            </Button>
          </div>
        </DashboardCard>

        <MobileSheet
          description="Tune skill, format, use case, and progress state without leaving the library."
          onOpenChange={setIsFiltersSheetOpen}
          open={isFiltersSheetOpen}
          title="Resource filters"
        >
          <FilterRow
            active={library.skillFilter}
            label="Skill"
            onChange={library.setSkillFilter}
            options={["all", ...library.skillOptions]}
          />
          <FilterRow
            active={library.formatFilter}
            label="Format"
            onChange={library.setFormatFilter}
            options={["all", ...library.formatOptions]}
          />
          <FilterRow
            active={library.useCaseFilter}
            label="Use case"
            onChange={library.setUseCaseFilter}
            options={["all", ...library.useCaseOptions]}
          />
          <FilterRow
            active={library.stateFilter}
            label="State"
            onChange={library.setStateFilter}
            options={[
              "all",
              "not_started",
              "in_progress",
              "completed",
              "needs_review",
              "skipped_for_now",
            ]}
          />
          <div className="mobile-stacked-actions pt-2">
            <Button onClick={() => setIsFiltersSheetOpen(false)}>Show results</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </MobileSheet>
      </div>

      <DashboardCard className="hidden p-5 sm:p-6 lg:block">
        <div className="flex items-center gap-3">
          <SectionEyebrow icon={Filter}>Filters</SectionEyebrow>
        </div>

        <div className="mt-5 space-y-5">
          <FilterRow
            active={library.skillFilter}
            label="Skill"
            onChange={library.setSkillFilter}
            options={["all", ...library.skillOptions]}
          />
          <FilterRow
            active={library.formatFilter}
            label="Format"
            onChange={library.setFormatFilter}
            options={["all", ...library.formatOptions]}
          />
          <FilterRow
            active={library.useCaseFilter}
            label="Use case"
            onChange={library.setUseCaseFilter}
            options={["all", ...library.useCaseOptions]}
          />
          <FilterRow
            active={library.stateFilter}
            label="State"
            onChange={library.setStateFilter}
            options={[
              "all",
              "not_started",
              "in_progress",
              "completed",
              "needs_review",
              "skipped_for_now",
            ]}
          />
        </div>
      </DashboardCard>

      {library.filteredResources.length === 0 ? (
        <DashboardCard className="p-6">
          <SectionEyebrow icon={BookMarked}>Nothing matches yet</SectionEyebrow>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Try widening the filters. This library is curated first, so a narrow
            combination can naturally reduce the list quickly.
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </div>
        </DashboardCard>
      ) : (
        <div className="grid gap-[var(--layout-gap)] xl:grid-cols-2">
          {library.filteredResources.map((resource) => (
            <article
              key={resource.id}
              id={`resource-${resource.id}`}
              className={cn(
                "rounded-[1.9rem] border border-surface-stroke bg-surface-panel p-5 shadow-panel animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]",
                getEntryState(library.progressById.get(resource.id)) === "in_progress" &&
                  "border-state-progress-border bg-surface-state-progress",
                getEntryState(library.progressById.get(resource.id)) === "completed" &&
                  "border-state-complete-border bg-surface-state-complete",
              )}
            >
              <div className="flex flex-wrap gap-2">
                {resource.isFeatured ? <SmallTag>Featured</SmallTag> : null}
                <SmallTag>{resource.role}</SmallTag>
                <SmallTag>{capitalize(resource.resourceTypeLabel)}</SmallTag>
                <StateTag state={getEntryState(library.progressById.get(resource.id))} />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {resource.sourceName} / {resource.primaryUseCaseLabel}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {resource.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {resource.note ?? resource.whyRecommended}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <SmallTag>{capitalize(resource.resourceFormatLabel)}</SmallTag>
                {getPrimarySkillLabel(resource) ? (
                  <SmallTag>{getPrimarySkillLabel(resource)}</SmallTag>
                ) : null}
                <SmallTag>{formatMinutes(resource.estimatedMinutes)}</SmallTag>
              </div>

              <div className="mt-5">
                <a
                  className={cn(
                    buttonVariants(),
                    "w-full rounded-full justify-center",
                  )}
                  href={resource.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight className="size-4" />
                  Visit resource
                </a>
              </div>

              <div className="mt-5 grid gap-4">
                {resource.description ? (
                  <Callout title="Overview" body={resource.description} />
                ) : null}
                <Callout title="Why recommended" body={resource.whyRecommended} />
                <Callout
                  title="Source context"
                  body={getSourceContext(resource)}
                />
                <Callout title="Best use case" body={resource.bestUseCase} />
                <Callout
                  title="What to do after"
                  body={
                    resource.followUpHint ??
                    "Keep the material active by reusing it in a short writing or speaking task."
                  }
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <SmallTag>{resource.accessTypeLabel}</SmallTag>
                <SmallTag>{resource.difficultyLabel}</SmallTag>
                {resource.cefrLabel ? <SmallTag>{resource.cefrLabel}</SmallTag> : null}
              </div>

              <InsetPanel tone="cream" className="mt-5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Skill fit
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.skills.map((skill) => (
                    <SmallTag key={`${resource.id}:${skill.slug}`}>
                      {skill.title}
                      {skill.emphasis === "primary" ? " core" : ""}
                    </SmallTag>
                  ))}
                </div>
              </InsetPanel>

              <InsetPanel tone="default" className="mt-5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Roadmap links
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.linkedBlocks.map((block) => (
                    <Link
                      key={`${resource.id}:${block.id}`}
                      href={`/roadmap#block-${block.id}`}
                      className="rounded-full border border-surface-stroke bg-surface-panel-strong px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground shadow-panel transition-colors hover:bg-surface-module-lavender"
                    >
                      {block.stageTitle} / {block.title}
                    </Link>
                  ))}
                </div>
              </InsetPanel>

              <div className="mobile-stacked-actions mt-5">
                <Button
                  disabled={library.busyAction?.startsWith(`resource:${resource.id}:`) ?? false}
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    void library.updateResourceState(
                      {
                        id: resource.id,
                        title: resource.title,
                        blockTitle: resource.linkedBlocks[0]?.title ?? "resource",
                      },
                      "in_progress",
                      "start",
                    )
                  }
                >
                  <Play className="size-4" />
                  Start
                </Button>
                <Button
                  disabled={library.busyAction?.startsWith(`resource:${resource.id}:`) ?? false}
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void library.updateResourceState(
                      {
                        id: resource.id,
                        title: resource.title,
                        blockTitle: resource.linkedBlocks[0]?.title ?? "resource",
                      },
                      "completed",
                      "complete",
                      "useful",
                    )
                  }
                >
                  <CheckCircle2 className="size-4" />
                  Mark useful
                </Button>
                <Button
                  disabled={library.busyAction?.startsWith(`resource:${resource.id}:`) ?? false}
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void library.updateResourceState(
                      {
                        id: resource.id,
                        title: resource.title,
                        blockTitle: resource.linkedBlocks[0]?.title ?? "resource",
                      },
                      "needs_review",
                      "difficult",
                      "hard",
                    )
                  }
                >
                  <Flag className="size-4" />
                  Mark difficult
                </Button>
                <Button
                  disabled={library.busyAction?.startsWith(`resource:${resource.id}:`) ?? false}
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    void library.updateResourceState(
                      {
                        id: resource.id,
                        title: resource.title,
                        blockTitle: resource.linkedBlocks[0]?.title ?? "resource",
                      },
                      "skipped_for_now",
                      "skip",
                    )
                  }
                >
                  <CircleSlash className="size-4" />
                  Skip for now
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

function FilterRow({
  active,
  label,
  onChange,
  options,
}: {
  active: string;
  label: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mobile-chip-row mt-3 lg:flex-wrap lg:overflow-visible lg:pb-0">
        {options.map((option) => (
          <button
            key={`${label}:${option}`}
            className={cn(
              "mobile-chip rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
              active === option
                ? "border-transparent bg-surface-dark-control text-primary-foreground shadow-control"
                : "border-surface-stroke bg-surface-panel-muted text-muted-foreground hover:bg-surface-module-cream",
            )}
            onClick={() => onChange(option)}
            type="button"
          >
            {humanizeChip(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <InsetPanel tone="default" className="p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-foreground">{body}</p>
    </InsetPanel>
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
      {humanizeChip(state)}
    </span>
  );
}

function getEntryState(entry: ProgressEntry | undefined) {
  return entry?.state ?? "not_started";
}

function getActiveFilterCount(values: string[]) {
  return values.filter((value) => value !== "all").length;
}

function getPrimarySkillLabel(resource: LibraryResourceCard) {
  const primarySkill =
    resource.skills.find((skill) => skill.emphasis === "primary") ??
    resource.skills[0];

  return primarySkill?.title;
}

function getSourceContext(resource: LibraryResourceCard) {
  const context = [
    resource.sourceName,
    resource.accessTypeLabel,
    resource.difficultyLabel,
    resource.cefrLabel,
  ].filter(Boolean);

  return context.join(" / ");
}

function humanizeChip(value: string) {
  if (value === "all") {
    return "All";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
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
