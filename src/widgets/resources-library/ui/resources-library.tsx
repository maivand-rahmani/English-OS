"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Filter,
  LibraryBig,
  Link2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type { ResourcesPageData } from "@/entities/resources";
import { cn } from "@/shared/lib/utils";
import { Button, MobileSheet, SearchInput } from "@/shared/ui";
import { DashboardCard, SectionEyebrow, SmallTag } from "@/shared/ui/surfaces";
import {
  RESOURCE_ROLE_OPTIONS,
  useResourcesLibrary,
} from "../model/use-resources-library";
import type {
  ActiveLibraryFilter,
  LibraryResource,
  LibraryShelf,
  ResourcePrimaryAction,
  ResourceStateFilter,
  SuggestedLibraryFilter,
} from "../model/use-resources-library";
import { ResourceDetailModal } from "./resource-detail-modal";
import { ResourceSignalFlags, ResourceStateBadge } from "./resource-state-badge";

type ResourcesLibraryProps = {
  content: ResourcesPageData;
};

type MobileFilterDraft = {
  format: string;
  level: string;
  role: string;
  skill: string;
  state: ResourceStateFilter;
  useCase: string;
};

export function ResourcesLibrary({ content }: ResourcesLibraryProps) {
  const library = useResourcesLibrary(content);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [mobileDraft, setMobileDraft] = useState<MobileFilterDraft>({
    format: library.formatFilter,
    level: library.levelFilter,
    role: library.roleFilter,
    skill: library.skillFilter,
    state: library.stateFilter,
    useCase: library.useCaseFilter,
  });

  const hasResources = library.resources.length > 0;

  function openMobileFilters() {
    setMobileDraft({
      format: library.formatFilter,
      level: library.levelFilter,
      role: library.roleFilter,
      skill: library.skillFilter,
      state: library.stateFilter,
      useCase: library.useCaseFilter,
    });
    setIsMobileSheetOpen(true);
  }

  function applyMobileFilters() {
    library.setFormatFilter(mobileDraft.format);
    library.setLevelFilter(mobileDraft.level);
    library.setRoleFilter(mobileDraft.role);
    library.setSkillFilter(mobileDraft.skill);
    library.setStateFilter(mobileDraft.state);
    library.setUseCaseFilter(mobileDraft.useCase);
    setIsMobileSheetOpen(false);
  }

  function clearMobileDraft() {
    setMobileDraft({
      format: "all",
      level: "all",
      role: "all",
      skill: "all",
      state: "all",
      useCase: "all",
    });
  }

  async function handleResourceAction(
    resource: LibraryResource,
    action: ResourcePrimaryAction,
  ) {
    await library.applyResourceAction(resource, action);
    setNotice(getNoticeMessage(resource.title, action));
    window.setTimeout(() => setNotice(null), 1800);
  }

  function handlePrimaryOpen(resource: LibraryResource) {
    if (
      resource.signal.state === "not_started" ||
      resource.signal.state === "skipped_for_now"
    ) {
      void library.applyResourceAction(resource, "start");
    }
  }

  if (!hasResources) {
    return (
      <section className="space-y-[var(--layout-gap)]">
        <DashboardCard className="p-6 sm:p-7">
          <SectionEyebrow icon={LibraryBig}>Curated library</SectionEyebrow>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Resources
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            No curated resources are connected yet. Once the roadmap links them in,
            this page will become the calmer discovery surface for the learner.
          </p>
          <div className="mt-5">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80"
            >
              <Link2 className="size-4" />
              Open roadmap
            </Link>
          </div>
        </DashboardCard>
      </section>
    );
  }

  return (
    <section className="space-y-[var(--layout-gap)]">
      <DiscoveryHero
        activeFilters={library.activeFilters}
        content={content}
        formatFilter={library.formatFilter}
        levelFilter={library.levelFilter}
        notice={notice}
        onClearAll={library.clearAllFilters}
        onClearFilter={library.clearFilter}
        onOpenMobileFilters={openMobileFilters}
        onQueryChange={library.setQuery}
        onSuggestedFilter={library.applySuggestedFilter}
        onToggleDesktopFilters={() => setIsDesktopFiltersOpen((value) => !value)}
        query={library.query}
        roleFilter={library.roleFilter}
        skillFilter={library.skillFilter}
        stateFilter={library.stateFilter}
        suggestedFilters={library.suggestedFilters}
        useCaseFilter={library.useCaseFilter}
      />

      {isDesktopFiltersOpen ? (
        <DashboardCard className="hidden p-4 lg:block">
          <DesktopFilterPanel
            formatFilter={library.formatFilter}
            formatOptions={library.formatOptions}
            levelFilter={library.levelFilter}
            levelOptions={library.levelOptions}
            roleFilter={library.roleFilter}
            setFormatFilter={library.setFormatFilter}
            setLevelFilter={library.setLevelFilter}
            setRoleFilter={library.setRoleFilter}
            setSkillFilter={library.setSkillFilter}
            setStateFilter={library.setStateFilter}
            setUseCaseFilter={library.setUseCaseFilter}
            skillFilter={library.skillFilter}
            skillOptions={library.skillOptions}
            stateFilter={library.stateFilter}
            useCaseFilter={library.useCaseFilter}
            useCaseOptions={library.useCaseOptions}
          />
        </DashboardCard>
      ) : null}

      {library.isLoading ? (
        <ResourceSkeletonGrid />
      ) : !library.isBrowseMode && library.matchingResources.length === 0 ? (
        <ResourceEmptyState
          query={library.query}
          stateFilter={library.stateFilter}
          onClearFilters={library.clearAllFilters}
        />
      ) : library.isBrowseMode ? (
        <div className="space-y-6">
          {library.shelves.map((shelf) => (
            <ResourceShelfSection
              key={shelf.id}
              onOpenDetails={library.openResource}
              onOpenResource={handlePrimaryOpen}
              shelf={shelf}
            />
          ))}
        </div>
      ) : (
        <MatchingResourcesSection
          activeFilters={library.activeFilters}
          onOpenDetails={library.openResource}
          onOpenResource={handlePrimaryOpen}
          query={library.query}
          resources={library.matchingResources}
        />
      )}

      <MobileSheet
        description="Choose filters without changing the results until you apply them."
        onOpenChange={setIsMobileSheetOpen}
        open={isMobileSheetOpen}
        title="Resource filters"
      >
        <FilterRow
          active={mobileDraft.skill}
          label="Skill"
          onChange={(value) => setMobileDraft((current) => ({ ...current, skill: value }))}
          options={["all", ...library.skillOptions]}
        />
        <FilterRow
          active={mobileDraft.state}
          label="State"
          onChange={(value) =>
            setMobileDraft((current) => ({
              ...current,
              state: value as ResourceStateFilter,
            }))
          }
          options={[
            "all",
            "not_started",
            "in_progress",
            "completed",
            "useful",
            "difficult",
            "needs_review",
            "skipped_for_now",
          ]}
        />
        <FilterRow
          active={mobileDraft.level}
          label="Level"
          onChange={(value) => setMobileDraft((current) => ({ ...current, level: value }))}
          options={["all", ...library.levelOptions]}
        />
        <FilterRow
          active={mobileDraft.format}
          label="Format"
          onChange={(value) => setMobileDraft((current) => ({ ...current, format: value }))}
          options={["all", ...library.formatOptions]}
        />
        <FilterRow
          active={mobileDraft.useCase}
          label="Use case"
          onChange={(value) => setMobileDraft((current) => ({ ...current, useCase: value }))}
          options={["all", ...library.useCaseOptions]}
        />
        <FilterRow
          active={mobileDraft.role}
          label="Role"
          onChange={(value) => setMobileDraft((current) => ({ ...current, role: value }))}
          options={["all", ...RESOURCE_ROLE_OPTIONS]}
        />

        <div className="mobile-stacked-actions pt-2">
          <Button onClick={applyMobileFilters}>Show matching resources</Button>
          <Button variant="outline" onClick={clearMobileDraft}>
            Clear all
          </Button>
        </div>
      </MobileSheet>

      <ResourceDetailModal
        busy={
          library.selectedResource
            ? Boolean(library.busyAction?.startsWith(`resource:${library.selectedResource.id}:`))
            : false
        }
        onAction={(action) =>
          library.selectedResource
            ? handleResourceAction(library.selectedResource, action)
            : Promise.resolve()
        }
        onClose={library.closeResource}
        resource={library.selectedResource}
      />
    </section>
  );
}

function DiscoveryHero({
  activeFilters,
  content,
  formatFilter,
  levelFilter,
  notice,
  onClearAll,
  onClearFilter,
  onOpenMobileFilters,
  onQueryChange,
  onSuggestedFilter,
  onToggleDesktopFilters,
  query,
  roleFilter,
  skillFilter,
  stateFilter,
  suggestedFilters,
  useCaseFilter,
}: {
  activeFilters: ActiveLibraryFilter[];
  content: ResourcesPageData;
  formatFilter: string;
  levelFilter: string;
  notice: string | null;
  onClearAll: () => void;
  onClearFilter: (key: ActiveLibraryFilter["key"]) => void;
  onOpenMobileFilters: () => void;
  onQueryChange: (value: string) => void;
  onSuggestedFilter: (filter: SuggestedLibraryFilter) => void;
  onToggleDesktopFilters: () => void;
  query: string;
  roleFilter: string;
  skillFilter: string;
  stateFilter: ResourceStateFilter;
  suggestedFilters: SuggestedLibraryFilter[];
  useCaseFilter: string;
}) {
  return (
    <DashboardCard className="overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_left,rgba(255,214,224,0.45),transparent_34%),radial-gradient(circle_at_top_right,rgba(198,214,255,0.35),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.25),transparent_80%)]" />
      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow icon={LibraryBig}>Curated library</SectionEyebrow>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.4rem]">
              Resources
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Search when you know what you need, or browse the shelves when you want
              a calmer way to discover the next useful resource.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <SmallTag>{content.resourceCount} resources</SmallTag>
            <SmallTag>{content.learnerLevelLabel}</SmallTag>
            <SmallTag>{content.templateTitle}</SmallTag>
            {content.estimatedWeeks ? <SmallTag>{content.estimatedWeeks} week arc</SmallTag> : null}
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 rounded-full border border-surface-stroke-strong bg-surface-panel px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground shadow-panel hover:bg-surface-panel-strong"
            >
              <Link2 className="size-3.5" />
              Open roadmap
            </Link>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Spotlight search
            </p>
            <SearchInput
              aria-label="Search resources"
              className="mt-3 h-11 rounded-[1rem] bg-white/85"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search resources, skills, roadmap steps, use cases..."
              value={query}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              className="hidden lg:inline-flex"
              size="sm"
              variant="outline"
              onClick={onToggleDesktopFilters}
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>
            <Button className="lg:hidden" size="sm" variant="outline" onClick={onOpenMobileFilters}>
              <Filter className="size-4" />
              Filters
              {activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>
          </div>
        </div>

        {suggestedFilters.length > 0 ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Suggested
            </p>
            <div className="mobile-chip-row mt-3 lg:flex-wrap lg:overflow-visible lg:pb-0">
              {suggestedFilters.map((filter) => {
                const isActive = isSuggestedFilterActive({
                  filter,
                  formatFilter,
                  levelFilter,
                  roleFilter,
                  skillFilter,
                  stateFilter,
                  useCaseFilter,
                });

                return (
                  <button
                    key={filter.id}
                    className={cn(
                      "mobile-chip inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                      isActive
                        ? "border-transparent bg-surface-dark-control text-primary-foreground shadow-control"
                        : "border-surface-stroke-strong bg-white/78 text-muted-foreground hover:bg-surface-module-cream",
                    )}
                    onClick={() => onSuggestedFilter(filter)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <ActiveFilterChips
          activeFilters={activeFilters}
          canClearAll={activeFilters.length > 0}
          notice={notice}
          onClearAll={onClearAll}
          onClearFilter={onClearFilter}
        />
      </div>
    </DashboardCard>
  );
}

function DesktopFilterPanel({
  formatFilter,
  formatOptions,
  levelFilter,
  levelOptions,
  roleFilter,
  setFormatFilter,
  setLevelFilter,
  setRoleFilter,
  setSkillFilter,
  setStateFilter,
  setUseCaseFilter,
  skillFilter,
  skillOptions,
  stateFilter,
  useCaseFilter,
  useCaseOptions,
}: {
  formatFilter: string;
  formatOptions: string[];
  levelFilter: string;
  levelOptions: string[];
  roleFilter: string;
  setFormatFilter: (value: string) => void;
  setLevelFilter: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setSkillFilter: (value: string) => void;
  setStateFilter: (value: ResourceStateFilter) => void;
  setUseCaseFilter: (value: string) => void;
  skillFilter: string;
  skillOptions: string[];
  stateFilter: ResourceStateFilter;
  useCaseFilter: string;
  useCaseOptions: string[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <FilterRow
        active={skillFilter}
        label="Skill"
        onChange={setSkillFilter}
        options={["all", ...skillOptions]}
      />
      <FilterRow
        active={stateFilter}
        label="State"
        onChange={(value) => setStateFilter(value as ResourceStateFilter)}
        options={[
          "all",
          "not_started",
          "in_progress",
          "completed",
          "useful",
          "difficult",
          "needs_review",
          "skipped_for_now",
        ]}
      />
      <FilterRow
        active={levelFilter}
        label="Level"
        onChange={setLevelFilter}
        options={["all", ...levelOptions]}
      />
      <FilterRow
        active={formatFilter}
        label="Format"
        onChange={setFormatFilter}
        options={["all", ...formatOptions]}
      />
      <FilterRow
        active={useCaseFilter}
        label="Use case"
        onChange={setUseCaseFilter}
        options={["all", ...useCaseOptions]}
      />
      <FilterRow
        active={roleFilter}
        label="Role"
        onChange={setRoleFilter}
        options={["all", ...RESOURCE_ROLE_OPTIONS]}
      />
    </div>
  );
}

function ResourceShelfSection({
  onOpenDetails,
  onOpenResource,
  shelf,
}: {
  onOpenDetails: (resourceId: string) => void;
  onOpenResource: (resource: LibraryResource) => void;
  shelf: LibraryShelf;
}) {
  if (shelf.resources.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shelf
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {shelf.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {shelf.description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {shelf.resources.map((resource) => (
          <ResourceTile
            key={resource.id}
            onOpenDetails={onOpenDetails}
            onOpenResource={onOpenResource}
            resource={resource}
          />
        ))}
      </div>
    </section>
  );
}

function MatchingResourcesSection({
  activeFilters,
  onOpenDetails,
  onOpenResource,
  query,
  resources,
}: {
  activeFilters: ActiveLibraryFilter[];
  onOpenDetails: (resourceId: string) => void;
  onOpenResource: (resource: LibraryResource) => void;
  query: string;
  resources: LibraryResource[];
}) {
  return (
    <section className="space-y-3">
      <DashboardCard className="p-4 sm:p-5">
        <SectionEyebrow icon={Search}>Matching resources</SectionEyebrow>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {resources.length} resource{resources.length === 1 ? "" : "s"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {query.trim()
            ? "Recommendation-first results for your search, with the extra chrome removed."
            : "Recommendation-first results for the active filters."}
        </p>
        {activeFilters.length > 0 ? (
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {activeFilters.length} active filter{activeFilters.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </DashboardCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {resources.map((resource) => (
          <ResourceTile
            key={resource.id}
            onOpenDetails={onOpenDetails}
            onOpenResource={onOpenResource}
            resource={resource}
          />
        ))}
      </div>
    </section>
  );
}

function ResourceTile({
  onOpenDetails,
  onOpenResource,
  resource,
}: {
  onOpenDetails: (resourceId: string) => void;
  onOpenResource: (resource: LibraryResource) => void;
  resource: LibraryResource;
}) {
  return (
    <article
      className={cn(
        "group rounded-[1.55rem] border p-4 shadow-panel transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(20,20,30,0.10)]",
        getCardTone(resource),
      )}
      id={`resource-${resource.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SmallTag>{resource.sourceName}</SmallTag>
        <SmallTag>{resource.roleLabel}</SmallTag>
        {resource.primarySkillLabel ? <SmallTag>{resource.primarySkillLabel}</SmallTag> : null}
        <ResourceStateBadge state={resource.signal.state} />
        <ResourceSignalFlags
          isDifficult={resource.signal.isDifficult}
          isUseful={resource.signal.isUseful}
        />
      </div>

      <button
        className="mt-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-module-lavender/60"
        onClick={() => onOpenDetails(resource.id)}
        type="button"
      >
        <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {resource.title}
        </h3>
      </button>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {resource.formatCategory} · {resource.useCaseCategory} · {resource.timeLabel}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {resource.recommendationReason}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {resource.levelTags[0] ? <SmallTag>{resource.levelTags.join(" / ")}</SmallTag> : null}
        <SmallTag>{resource.resourceTypeLabel}</SmallTag>
        <SmallTag>{resource.accessTypeLabel}</SmallTag>
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {resource.roadmapLabel}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          className="inline-flex items-center gap-2 rounded-full bg-surface-dark-control px-4 py-2 text-sm font-semibold text-primary-foreground shadow-control"
          href={resource.url}
          rel="noreferrer"
          target="_blank"
          onClick={() => onOpenResource(resource)}
        >
          <ArrowUpRight className="size-4" />
          {resource.primaryCtaLabel}
        </a>
        <Button size="sm" variant="outline" onClick={() => onOpenDetails(resource.id)}>
          Details
        </Button>
      </div>
    </article>
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
  options: readonly string[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mobile-chip-row mt-3 lg:flex-wrap lg:overflow-visible lg:pb-0">
        {options.map((option) => (
          <button
            key={`${label}:${option}`}
            className={cn(
              "mobile-chip inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
              active === option
                ? "border-transparent bg-surface-dark-control text-primary-foreground shadow-control"
                : "border-surface-stroke-strong bg-white/72 text-muted-foreground hover:bg-surface-module-cream",
            )}
            onClick={() => onChange(option)}
            type="button"
          >
            {humanizeLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActiveFilterChips({
  activeFilters,
  canClearAll,
  notice,
  onClearAll,
  onClearFilter,
}: {
  activeFilters: ActiveLibraryFilter[];
  canClearAll: boolean;
  notice: string | null;
  onClearAll: () => void;
  onClearFilter: (key: ActiveLibraryFilter["key"]) => void;
}) {
  if (activeFilters.length === 0 && !notice) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-surface-stroke pt-4">
      {activeFilters.map((filter) => (
        <button
          key={`${filter.key}:${filter.value}`}
          className="inline-flex items-center gap-2 rounded-full border border-surface-stroke-strong bg-white/80 px-3 py-1 text-xs font-semibold text-foreground"
          onClick={() => onClearFilter(filter.key)}
          type="button"
        >
          <span className="uppercase tracking-[0.18em] text-muted-foreground">{filter.label}</span>
          <span>{filter.value}</span>
          <span aria-hidden="true">x</span>
        </button>
      ))}
      {canClearAll ? (
        <Button size="sm" variant="ghost" onClick={onClearAll}>
          Clear all
        </Button>
      ) : null}
      {notice ? (
        <div
          aria-live="polite"
          className="rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-700"
        >
          {notice}
        </div>
      ) : null}
    </div>
  );
}

function ResourceEmptyState({
  onClearFilters,
  query,
  stateFilter,
}: {
  onClearFilters: () => void;
  query: string;
  stateFilter: ResourceStateFilter;
}) {
  return (
    <DashboardCard className="p-6 sm:p-7">
      <SectionEyebrow icon={Filter}>No matching resources</SectionEyebrow>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {getEmptyStateMessage(query, stateFilter)}
      </p>
      <div className="mt-5">
        <Button size="sm" variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    </DashboardCard>
  );
}

function ResourceSkeletonGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <DashboardCard key={index} className="animate-pulse p-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-white/70" />
            <div className="h-6 w-20 rounded-full bg-white/60" />
            <div className="h-6 w-24 rounded-full bg-white/65" />
          </div>
          <div className="mt-5 h-6 w-3/4 rounded-full bg-white/72" />
          <div className="mt-3 h-4 w-full rounded-full bg-white/62" />
          <div className="mt-2 h-4 w-5/6 rounded-full bg-white/58" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-white/60" />
            <div className="h-6 w-18 rounded-full bg-white/56" />
            <div className="h-6 w-20 rounded-full bg-white/64" />
          </div>
          <div className="mt-4 h-4 w-1/2 rounded-full bg-white/58" />
          <div className="mt-4 flex gap-2">
            <div className="h-10 w-28 rounded-full bg-white/70" />
            <div className="h-10 w-20 rounded-full bg-white/62" />
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

function isSuggestedFilterActive({
  filter,
  formatFilter,
  levelFilter,
  roleFilter,
  skillFilter,
  stateFilter,
  useCaseFilter,
}: {
  filter: SuggestedLibraryFilter;
  formatFilter: string;
  levelFilter: string;
  roleFilter: string;
  skillFilter: string;
  stateFilter: ResourceStateFilter;
  useCaseFilter: string;
}) {
  if (filter.key === "skill") {
    return skillFilter === filter.value;
  }

  if (filter.key === "level") {
    return levelFilter === filter.value;
  }

  if (filter.key === "format") {
    return formatFilter === filter.value;
  }

  if (filter.key === "use_case") {
    return useCaseFilter === filter.value;
  }

  if (filter.key === "state") {
    return stateFilter === filter.value;
  }

  return roleFilter === filter.value;
}

function getCardTone(resource: LibraryResource) {
  if (resource.signal.state === "in_progress") {
    return "border-sky-200 bg-[linear-gradient(135deg,rgba(235,246,255,0.92),rgba(255,255,255,0.92))]";
  }

  if (resource.signal.state === "completed") {
    return "border-emerald-200 bg-[linear-gradient(135deg,rgba(236,251,242,0.92),rgba(255,255,255,0.92))]";
  }

  if (resource.signal.state === "needs_review") {
    return "border-amber-200 bg-[linear-gradient(135deg,rgba(255,247,232,0.94),rgba(255,255,255,0.92))]";
  }

  if (resource.signal.state === "skipped_for_now") {
    return "border-slate-200 bg-[linear-gradient(135deg,rgba(247,247,250,0.94),rgba(255,255,255,0.9))]";
  }

  return "border-surface-stroke-strong bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,246,252,0.92))]";
}

function getNoticeMessage(title: string, action: ResourcePrimaryAction) {
  if (action === "useful") {
    return `${title} marked useful`;
  }

  if (action === "difficult") {
    return `${title} marked difficult`;
  }

  if (action === "review") {
    return `${title} added to review`;
  }

  if (action === "skip") {
    return `${title} skipped for now`;
  }

  if (action === "reset") {
    return `${title} reset`;
  }

  if (action === "complete") {
    return `${title} marked completed`;
  }

  return `${title} started`;
}

function getEmptyStateMessage(query: string, stateFilter: ResourceStateFilter) {
  if (query.trim()) {
    return "No resources match that search. Try broader keywords or remove one of the active filters.";
  }

  if (stateFilter === "completed") {
    return "Completed resources will appear here after you finish them.";
  }

  if (stateFilter === "useful") {
    return "Resources marked useful will appear here after you save that signal.";
  }

  if (stateFilter === "difficult") {
    return "Resources marked difficult will appear here for another pass.";
  }

  if (stateFilter === "needs_review") {
    return "Resources that need review will collect here once you flag them.";
  }

  return "No resources match these filters. Try removing one filter group or clear them all.";
}

function humanizeLabel(value: string) {
  if (value === "all") {
    return "All";
  }

  return value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
}
