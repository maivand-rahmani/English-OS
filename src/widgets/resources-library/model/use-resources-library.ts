"use client";

import { useDeferredValue, useEffect, useState } from "react";

import type { DashboardSkill } from "@/entities/dashboard";
import type {
  ResourcesPageData,
  ResourcesPageResource,
} from "@/entities/resources";
import { useLearningContentProgress } from "@/shared/hooks";
import { LearningEventType, type LearningEvent, type ProgressEntry } from "@/shared/types";

export const RESOURCE_ROLE_OPTIONS = ["core", "supporting", "optional"] as const;

export type ResourceStateFilter =
  | "all"
  | "not_started"
  | "in_progress"
  | "completed"
  | "useful"
  | "difficult"
  | "needs_review"
  | "skipped_for_now";

export type ResourceRoleOption = (typeof RESOURCE_ROLE_OPTIONS)[number];
export type ResourcePrimaryAction =
  | "start"
  | "complete"
  | "useful"
  | "difficult"
  | "review"
  | "skip"
  | "reset";

type FilterKey = "query" | "skill" | "level" | "format" | "use_case" | "state" | "role";
type NormalizedProgressState =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_review"
  | "skipped_for_now";

type LinkedBlock = {
  id: string;
  note: string | null;
  roleLabel: string;
  slug: string;
  stageTitle: string;
  state: NormalizedProgressState;
  title: string;
};

type ResourceSignal = {
  isDifficult: boolean;
  isUseful: boolean;
  lastTouchedAt: number;
  state: NormalizedProgressState;
  stateLabel: string;
};

export type LibraryResource = ResourcesPageResource & {
  addedOrder: number;
  formatCategory: string;
  howToUseSteps: string[];
  levelTags: string[];
  linkedBlocks: LinkedBlock[];
  nextAction: string;
  primaryCtaLabel: string;
  primarySkillLabel: string | null;
  recommendationReason: string;
  recommendationScore: number;
  roleLabel: string;
  roleValue: ResourceRoleOption;
  roadmapLabel: string;
  searchText: string;
  secondarySkillLabels: string[];
  signal: ResourceSignal;
  timeLabel: string;
  useCaseCategory: string;
};

export type LibraryShelf = {
  description: string;
  id: string;
  resources: LibraryResource[];
  title: string;
};

export type ActiveLibraryFilter = {
  key: FilterKey;
  label: string;
  value: string;
};

export type SuggestedLibraryFilter = {
  id: string;
  key: Exclude<FilterKey, "query" | "role">;
  label: string;
  value: string;
};

function getInitialSearchParam(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export function useResourcesLibrary(content: ResourcesPageData) {
  const progress = useLearningContentProgress(
    Math.min(320, Math.max(80, content.resourceCount * 8)),
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState(() => getInitialSearchParam("q"));
  const [skillFilter, setSkillFilter] = useState(() => getInitialSearchParam("skill") || "all");
  const [levelFilter, setLevelFilter] = useState(() => getInitialSearchParam("level") || "all");
  const [formatFilter, setFormatFilter] = useState(() => getInitialSearchParam("format") || "all");
  const [useCaseFilter, setUseCaseFilter] = useState(() => getInitialSearchParam("use") || "all");
  const [stateFilter, setStateFilter] = useState<ResourceStateFilter>(
    () => (getInitialSearchParam("state") as ResourceStateFilter) || "all",
  );
  const [roleFilter, setRoleFilter] = useState(() => getInitialSearchParam("role") || "all");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const resources = buildResourceCollection(content, progress.entries, progress.events);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    syncSearchParam(url.searchParams, "q", query);
    syncSearchParam(url.searchParams, "skill", skillFilter);
    syncSearchParam(url.searchParams, "level", levelFilter);
    syncSearchParam(url.searchParams, "format", formatFilter);
    syncSearchParam(url.searchParams, "use", useCaseFilter);
    syncSearchParam(url.searchParams, "state", stateFilter);
    syncSearchParam(url.searchParams, "role", roleFilter);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [formatFilter, levelFilter, query, roleFilter, skillFilter, stateFilter, useCaseFilter]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function syncSelectionWithHash() {
      const hash = window.location.hash;
      if (!hash.startsWith("#resource-")) {
        return;
      }

      const resourceId = hash.replace("#resource-", "");
      if (resources.some((resource) => resource.id === resourceId)) {
        setSelectedResourceId(resourceId);
      }
    }

    syncSelectionWithHash();
    window.addEventListener("hashchange", syncSelectionWithHash);

    return () => window.removeEventListener("hashchange", syncSelectionWithHash);
  }, [resources]);

  const filteredResources = resources.filter((resource) => {
    if (deferredQuery.trim()) {
      const normalizedQuery = normalizeForSearch(deferredQuery);
      if (!resource.searchText.includes(normalizedQuery)) {
        return false;
      }
    }

    if (
      skillFilter !== "all" &&
      !resource.skills.some((skill) => skill.title === skillFilter)
    ) {
      return false;
    }

    if (levelFilter !== "all" && !resource.levelTags.includes(levelFilter)) {
      return false;
    }

    if (formatFilter !== "all" && resource.formatCategory !== formatFilter) {
      return false;
    }

    if (useCaseFilter !== "all" && resource.useCaseCategory !== useCaseFilter) {
      return false;
    }

    if (roleFilter !== "all" && resource.roleValue !== roleFilter) {
      return false;
    }

    if (!matchesStateFilter(resource, stateFilter)) {
      return false;
    }

    return true;
  });

  const matchingResources = [...filteredResources].sort((left, right) =>
    compareResources(left, right),
  );
  const activeFilters = buildActiveFilters({
    formatFilter,
    levelFilter,
    query,
    roleFilter,
    skillFilter,
    stateFilter,
    useCaseFilter,
  });
  const isBrowseMode = !query.trim() && activeFilters.length === 0;
  const shelves = isBrowseMode ? buildEditorialShelves(resources) : [];
  const selectedResource =
    resources.find((resource) => resource.id === selectedResourceId) ?? null;
  const skillOptions = uniqueValues(
    resources.flatMap((resource) => resource.skills.map((skill) => skill.title)),
  ).sort((left, right) => left.localeCompare(right));
  const levelOptions = uniqueValues(resources.flatMap((resource) => resource.levelTags)).sort(
    (left, right) => getLevelRank(left) - getLevelRank(right),
  );
  const formatOptions = uniqueValues(resources.map((resource) => resource.formatCategory)).sort(
    (left, right) => left.localeCompare(right),
  );
  const useCaseOptions = uniqueValues(resources.map((resource) => resource.useCaseCategory)).sort(
    (left, right) => left.localeCompare(right),
  );
  const stateCounts = {
    completed: resources.filter((resource) => resource.signal.state === "completed").length,
    difficult: resources.filter((resource) => resource.signal.isDifficult).length,
    inProgress: resources.filter((resource) => resource.signal.state === "in_progress").length,
    needsReview: resources.filter((resource) => resource.signal.state === "needs_review").length,
    skipped: resources.filter((resource) => resource.signal.state === "skipped_for_now").length,
    useful: resources.filter((resource) => resource.signal.isUseful).length,
  };
  const suggestedFilters = buildSuggestedFilters(resources, stateCounts);

  function openResource(resourceId: string) {
    setSelectedResourceId(resourceId);

    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = `resource-${resourceId}`;
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function closeResource() {
    setSelectedResourceId(null);

    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
  }

  async function applyResourceAction(resource: LibraryResource, action: ResourcePrimaryAction) {
    try {
      const target = {
        blockTitle: resource.linkedBlocks[0]?.title ?? "resource",
        id: resource.id,
        title: resource.title,
      };

      if (action === "start") {
        await progress.updateResourceState(target, "in_progress", "start");
        return;
      }

      if (action === "complete") {
        await progress.updateResourceState(target, "completed", "complete");
        return;
      }

      if (action === "useful") {
        await progress.markResourceUseful(target);
        return;
      }

      if (action === "difficult") {
        await progress.markResourceDifficult(target);
        return;
      }

      if (action === "review") {
        await progress.updateResourceState(target, "needs_review", "review");
        return;
      }

      if (action === "skip") {
        await progress.updateResourceState(target, "skipped_for_now", "skip");
        return;
      }

      await progress.resetResourceState(target);
    } catch (err) {
      setActionError(formatActionError(action, err));
      throw err;
    }
  }

  function clearActionError() {
    setActionError(null);
  }

  function applySuggestedFilter(filter: SuggestedLibraryFilter) {
    if (filter.key === "skill") {
      setSkillFilter(skillFilter === filter.value ? "all" : filter.value);
      return;
    }

    if (filter.key === "level") {
      setLevelFilter(levelFilter === filter.value ? "all" : filter.value);
      return;
    }

    if (filter.key === "format") {
      setFormatFilter(formatFilter === filter.value ? "all" : filter.value);
      return;
    }

    if (filter.key === "use_case") {
      setUseCaseFilter(useCaseFilter === filter.value ? "all" : filter.value);
      return;
    }

    setStateFilter(stateFilter === filter.value ? "all" : (filter.value as ResourceStateFilter));
  }

  function clearAllFilters() {
    setFormatFilter("all");
    setLevelFilter("all");
    setQuery("");
    setRoleFilter("all");
    setSkillFilter("all");
    setStateFilter("all");
    setUseCaseFilter("all");
  }

  function clearFilter(key: ActiveLibraryFilter["key"]) {
    if (key === "query") {
      setQuery("");
      return;
    }

    if (key === "skill") {
      setSkillFilter("all");
      return;
    }

    if (key === "level") {
      setLevelFilter("all");
      return;
    }

    if (key === "format") {
      setFormatFilter("all");
      return;
    }

    if (key === "use_case") {
      setUseCaseFilter("all");
      return;
    }

    if (key === "state") {
      setStateFilter("all");
      return;
    }

    setRoleFilter("all");
  }

  return {
    actionError,
    activeFilters,
    applyResourceAction,
    applySuggestedFilter,
    busyAction: progress.busyAction,
    clearActionError,
    clearAllFilters,
    clearFilter,
    closeResource,
    formatFilter,
    formatOptions,
    isBrowseMode,
    isLoading: progress.isLoading,
    levelFilter,
    levelOptions,
    matchingResources,
    openResource,
    query,
    resources,
    roleFilter,
    selectedResource,
    setFormatFilter,
    setLevelFilter,
    setQuery,
    setRoleFilter,
    setSkillFilter,
    setStateFilter,
    setUseCaseFilter,
    shelves,
    skillFilter,
    skillOptions,
    stateCounts,
    stateFilter,
    suggestedFilters,
    useCaseFilter,
    useCaseOptions,
  } as const;
}

function buildResourceCollection(
  content: ResourcesPageData,
  entries: ProgressEntry[],
  events: LearningEvent[],
) {
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const latestCompletionById = new Map<string, "easy" | "hard" | "useful" | "confusing" | null>();
  const latestCompletionTimestampById = new Map<string, number>();
  const latestDifficultyTimestampById = new Map<string, number>();
  const latestUsefulTimestampById = new Map<string, number>();
  const latestResetTimestampById = new Map<string, number>();
  const latestSkipTimestampById = new Map<string, number>();

  for (const event of events) {
    if (event.type === LearningEventType.ResourceReset) {
      if (!latestResetTimestampById.has(event.payload.resourceId)) {
        latestResetTimestampById.set(event.payload.resourceId, event.timestamp);
      }
      continue;
    }

    if (event.type === LearningEventType.ResourceMarkedUseful) {
      if (!latestUsefulTimestampById.has(event.payload.resourceId)) {
        latestUsefulTimestampById.set(event.payload.resourceId, event.timestamp);
      }
      continue;
    }

    if (event.type === LearningEventType.ResourceCompleted) {
      if (!latestCompletionById.has(event.payload.resourceId)) {
        latestCompletionById.set(event.payload.resourceId, event.payload.reflection ?? null);
        latestCompletionTimestampById.set(event.payload.resourceId, event.timestamp);
      }
      continue;
    }

    if (event.type === LearningEventType.ResourceMarkedDifficult) {
      if (!latestDifficultyTimestampById.has(event.payload.resourceId)) {
        latestDifficultyTimestampById.set(event.payload.resourceId, event.timestamp);
      }
      continue;
    }

    if (event.type === LearningEventType.ItemSkipped && event.payload.itemType === "resource") {
      if (!latestSkipTimestampById.has(event.payload.itemId)) {
        latestSkipTimestampById.set(event.payload.itemId, event.timestamp);
      }
    }
  }

  return content.resources
    .map((resource, addedOrder) => {
      const primarySkill = getPrimarySkill(resource.skills);
      const secondarySkills = resource.skills
        .filter((skill) => skill.slug !== primarySkill?.slug)
        .map((skill) => skill.title);
      const linkedBlocks = resource.roadmapLinks.map((link) => ({
        id: link.blockId,
        note: link.note,
        roleLabel: humanizeLabel(normalizeRole(link.role)),
        slug: link.blockSlug,
        stageTitle: link.stageTitle,
        state: getEntryState(progressById.get(link.blockId)),
        title: link.blockTitle,
      }));
      const signal = buildResourceSignal(
        resource.id,
        progressById,
        latestCompletionById,
        latestCompletionTimestampById,
        latestDifficultyTimestampById,
        latestUsefulTimestampById,
        latestResetTimestampById,
        latestSkipTimestampById,
      );
      const roleValue = getResourceRoleValue(resource);
      const formatCategory = getFormatCategory(resource);
      const useCaseCategory = getUseCaseCategory(resource, primarySkill?.title ?? null);
      const levelTags = getLevelTags(resource.cefrLabel);
      const roadmapLabel = getRoadmapLabel(linkedBlocks);

      return {
        ...resource,
        addedOrder,
        formatCategory,
        howToUseSteps: buildHowToUseSteps(resource, primarySkill?.title ?? null),
        levelTags,
        linkedBlocks,
        nextAction:
          resource.followUpHint ??
          "Return to the linked roadmap step and reuse one sentence or pattern immediately.",
        primaryCtaLabel: getPrimaryCtaLabel(signal.state),
        primarySkillLabel: primarySkill?.title ?? null,
        recommendationReason: "",
        recommendationScore: 0,
        roleLabel: humanizeLabel(roleValue),
        roleValue,
        roadmapLabel,
        searchText: normalizeForSearch(
          [
            resource.title,
            resource.sourceName,
            resource.description,
            resource.whyRecommended,
            resource.bestUseCase,
            formatCategory,
            useCaseCategory,
            levelTags.join(" "),
            roleValue,
            resource.skills.map((skill) => skill.title).join(" "),
            linkedBlocks.map((block) => `${block.stageTitle} ${block.title}`).join(" "),
            linkedBlocks.map((block) => block.note ?? "").join(" "),
          ]
            .filter(Boolean)
            .join(" "),
        ),
        secondarySkillLabels: secondarySkills,
        signal,
        timeLabel: formatMinutes(resource.estimatedMinutes),
        useCaseCategory,
      };
    })
    .map((resource) => {
      const recommendationReason = getRecommendationReason(resource);
      const recommendationScore = getRecommendationScore(resource, content.learnerLevelLabel);

      return {
        ...resource,
        recommendationReason,
        recommendationScore,
      };
    })
    .sort((left, right) => compareResources(left, right));
}

function buildResourceSignal(
  resourceId: string,
  progressById: Map<string, ProgressEntry>,
  latestCompletionById: Map<string, "easy" | "hard" | "useful" | "confusing" | null>,
  latestCompletionTimestampById: Map<string, number>,
  latestDifficultyTimestampById: Map<string, number>,
  latestUsefulTimestampById: Map<string, number>,
  latestResetTimestampById: Map<string, number>,
  latestSkipTimestampById: Map<string, number>,
): ResourceSignal {
  const entry = progressById.get(resourceId);
  const state = getEntryState(entry);
  const resetTimestamp = latestResetTimestampById.get(resourceId) ?? 0;
  const completionTimestamp = getSignalTimestamp(
    latestCompletionTimestampById.get(resourceId),
    resetTimestamp,
  );
  const usefulTimestamp = getSignalTimestamp(
    latestUsefulTimestampById.get(resourceId),
    resetTimestamp,
  );
  const difficultyTimestamp = getSignalTimestamp(
    latestDifficultyTimestampById.get(resourceId),
    resetTimestamp,
  );
  const skipTimestamp = getSignalTimestamp(
    latestSkipTimestampById.get(resourceId),
    resetTimestamp,
  );
  const completionReflection =
    completionTimestamp > 0 ? latestCompletionById.get(resourceId) ?? null : null;
  const isUseful =
    usefulTimestamp > 0 ||
    completionReflection === "useful";
  const isDifficult =
    difficultyTimestamp > 0 ||
    completionReflection === "hard" ||
    completionReflection === "confusing";

  return {
    isDifficult,
    isUseful,
    lastTouchedAt: Math.max(
      entry?.updatedAt ?? 0,
      completionTimestamp,
      usefulTimestamp,
      difficultyTimestamp,
      skipTimestamp,
      resetTimestamp,
    ),
    state,
    stateLabel: humanizeLabel(state),
  };
}

function buildEditorialShelves(resources: LibraryResource[]) {
  const shelves: LibraryShelf[] = [];
  const additionalShelfAssignment = new Set<string>();
  const stateReservedIds = new Set<string>();

  for (const resource of resources) {
    if (qualifiesForNeedsReviewShelf(resource)) {
      stateReservedIds.add(resource.id);
      continue;
    }

    if (qualifiesForUsefulShelf(resource)) {
      stateReservedIds.add(resource.id);
      continue;
    }

    if (qualifiesForRecentlyUsedShelf(resource)) {
      stateReservedIds.add(resource.id);
    }
  }

  const recommended = resources.slice(0, Math.min(6, resources.length));
  if (recommended.length > 0) {
    shelves.push({
      description: "Best next picks, ordered to keep the roadmap feeling clear instead of noisy.",
      id: "recommended-roadmap",
      resources: recommended,
      title: "Recommended for your roadmap",
    });
  }

  const startHere = assignShelfResources(
    resources,
    additionalShelfAssignment,
    (resource) =>
      resource.signal.state === "not_started" &&
      (resource.roleValue === "core" ||
        resource.isFeatured ||
        resource.useCaseCategory === "First resource"),
  );
  if (startHere.length > 0) {
    shelves.push({
      description: "Low-friction starting points when you want clarity more than browsing.",
      id: "start-here",
      resources: startHere,
      title: "Start here",
    });
  }

  const topicalShelves = [
    {
      description: "Resources that quickly repair weak grammar patterns.",
      id: "topic-grammar-repair",
      match: (resource: LibraryResource) => resource.useCaseCategory === "Grammar repair",
      title: "Grammar repair",
    },
    {
      description: "Fast lookup tools for meaning, usage, and example sentences.",
      id: "topic-word-lookup",
      match: (resource: LibraryResource) => resource.useCaseCategory === "Word lookup",
      title: "Vocabulary lookup",
    },
    {
      description: "Listening-first inputs that help you stay connected to real English.",
      id: "topic-listening-input",
      match: (resource: LibraryResource) => resource.useCaseCategory === "Listening input",
      title: "Listening input",
    },
    {
      description: "Reliable practice resources that are easy to return to every day.",
      id: "topic-daily-practice",
      match: (resource: LibraryResource) => resource.useCaseCategory === "Daily practice",
      title: "Daily practice",
    },
  ] as const;

  for (const shelf of topicalShelves) {
    const items = assignShelfResources(
      resources,
      additionalShelfAssignment,
      (resource) => shelf.match(resource) && !stateReservedIds.has(resource.id),
    );

    if (items.length === 0) {
      continue;
    }

    shelves.push({
      description: shelf.description,
      id: shelf.id,
      resources: items,
      title: shelf.title,
    });
  }

  const needsReview = assignShelfResources(
    resources,
    additionalShelfAssignment,
    qualifiesForNeedsReviewShelf,
  );
  if (needsReview.length > 0) {
    shelves.push({
      description: "Short second passes that deserve attention before new material piles up.",
      id: "needs-review",
      resources: needsReview,
      title: "Needs review",
    });
  }

  const usefulResources = assignShelfResources(
    resources,
    additionalShelfAssignment,
    qualifiesForUsefulShelf,
  );
  if (usefulResources.length > 0) {
    shelves.push({
      description: "Resources you marked worth keeping close for future sessions.",
      id: "useful-resources",
      resources: usefulResources,
      title: "Useful resources",
    });
  }

  const recentlyUsed = assignShelfResources(
    resources,
    additionalShelfAssignment,
    qualifiesForRecentlyUsedShelf,
  );
  if (recentlyUsed.length > 0) {
    shelves.push({
      description: "Items you touched recently and may want to reopen without hunting for them.",
      id: "recently-used",
      resources: recentlyUsed,
      title: "Recently used",
    });
  }

  return shelves;
}

function assignShelfResources(
  resources: LibraryResource[],
  assigned: Set<string>,
  predicate: (resource: LibraryResource) => boolean,
) {
  const items: LibraryResource[] = [];

  for (const resource of resources) {
    if (assigned.has(resource.id) || !predicate(resource)) {
      continue;
    }

    items.push(resource);
    assigned.add(resource.id);

    if (items.length === 4) {
      break;
    }
  }

  return items;
}

function buildSuggestedFilters(
  resources: LibraryResource[],
  stateCounts: {
    completed: number;
    difficult: number;
    inProgress: number;
    needsReview: number;
    skipped: number;
    useful: number;
  },
) {
  const suggested: SuggestedLibraryFilter[] = [];

  if (stateCounts.inProgress > 0) {
    suggested.push({
      id: "state:in_progress",
      key: "state",
      label: "In progress",
      value: "in_progress",
    });
  }

  if (stateCounts.needsReview > 0) {
    suggested.push({
      id: "state:needs_review",
      key: "state",
      label: "Needs review",
      value: "needs_review",
    });
  }

  if (stateCounts.useful > 0) {
    suggested.push({
      id: "state:useful",
      key: "state",
      label: "Useful resources",
      value: "useful",
    });
  }

  for (const skill of topCounts(
    resources.flatMap((resource) =>
      resource.skills.map((mappedSkill) => mappedSkill.title),
    ),
    2,
  )) {
    suggested.push({
      id: `skill:${skill}`,
      key: "skill",
      label: skill,
      value: skill,
    });
  }

  for (const useCase of topCounts(
    resources.map((resource) => resource.useCaseCategory),
    2,
  )) {
    suggested.push({
      id: `use:${useCase}`,
      key: "use_case",
      label: useCase,
      value: useCase,
    });
  }

  return suggested.slice(0, 6);
}

function buildActiveFilters(filters: {
  formatFilter: string;
  levelFilter: string;
  query: string;
  roleFilter: string;
  skillFilter: string;
  stateFilter: ResourceStateFilter;
  useCaseFilter: string;
}) {
  const activeFilters: ActiveLibraryFilter[] = [];

  if (filters.query.trim()) {
    activeFilters.push({
      key: "query",
      label: "Search",
      value: filters.query.trim(),
    });
  }

  if (filters.skillFilter !== "all") {
    activeFilters.push({
      key: "skill",
      label: "Skill",
      value: filters.skillFilter,
    });
  }

  if (filters.levelFilter !== "all") {
    activeFilters.push({
      key: "level",
      label: "Level",
      value: filters.levelFilter,
    });
  }

  if (filters.formatFilter !== "all") {
    activeFilters.push({
      key: "format",
      label: "Format",
      value: filters.formatFilter,
    });
  }

  if (filters.useCaseFilter !== "all") {
    activeFilters.push({
      key: "use_case",
      label: "Use case",
      value: filters.useCaseFilter,
    });
  }

  if (filters.stateFilter !== "all") {
    activeFilters.push({
      key: "state",
      label: "State",
      value: humanizeLabel(filters.stateFilter),
    });
  }

  if (filters.roleFilter !== "all") {
    activeFilters.push({
      key: "role",
      label: "Role",
      value: humanizeLabel(filters.roleFilter),
    });
  }

  return activeFilters;
}

function compareResources(left: LibraryResource, right: LibraryResource) {
  return (
    right.recommendationScore - left.recommendationScore ||
    left.title.localeCompare(right.title)
  );
}

function getRecommendationReason(resource: LibraryResource) {
  const activeBlock = resource.linkedBlocks.find((block) => block.state === "in_progress");

  if (resource.signal.state === "in_progress") {
    return "Already in progress, so this is the clearest place to continue without context switching.";
  }

  if (resource.signal.state === "needs_review") {
    return "Marked for review, so it deserves a short second pass before new material piles up.";
  }

  if (activeBlock) {
    return `Connected to your active roadmap step, ${activeBlock.title}, so it supports the work you are already doing.`;
  }

  if (resource.isFeatured) {
    return resource.whyRecommended;
  }

  if (resource.roleValue === "core") {
    return "Core support for your roadmap, which makes it the safest next pick when you want less chaos.";
  }

  return resource.whyRecommended;
}

function getRecommendationScore(resource: LibraryResource, learnerLevelLabel: string) {
  let score = 0;

  if (resource.signal.state === "in_progress") {
    score += 420;
  }

  if (resource.signal.state === "needs_review") {
    score += 320;
  }

  if (resource.linkedBlocks.some((block) => block.state === "in_progress")) {
    score += 240;
  }

  if (resource.roleValue === "core") {
    score += 180;
  }

  if (resource.isFeatured) {
    score += 150;
  }

  if (resource.signal.state === "not_started") {
    score += 110;
  }

  if (resource.levelTags.includes(learnerLevelLabel)) {
    score += 70;
  }

  if (resource.signal.isUseful) {
    score += 28;
  }

  if (resource.signal.state === "completed") {
    score -= 60;
  }

  if (resource.signal.state === "skipped_for_now") {
    score -= 90;
  }

  score += Math.max(0, 24 - resource.addedOrder);

  return score;
}

function getPrimarySkill(skills: DashboardSkill[]) {
  return skills.find((skill) => skill.emphasis === "primary") ?? skills[0];
}

function getPrimaryCtaLabel(state: NormalizedProgressState) {
  if (state === "in_progress") {
    return "Continue";
  }

  if (state === "completed") {
    return "Open again";
  }

  if (state === "needs_review") {
    return "Review";
  }

  if (state === "skipped_for_now") {
    return "Restart";
  }

  return "Start";
}

function getFormatCategory(resource: ResourcesPageResource) {
  const title = resource.title.toLowerCase();

  if (title.includes("dictionary")) {
    return "Dictionary";
  }

  if (resource.resourceTypeLabel.toLowerCase() === "course") {
    return "Course";
  }

  if (resource.resourceFormatLabel.toLowerCase() === "video") {
    return "Video";
  }

  if (resource.resourceFormatLabel.toLowerCase() === "interactive") {
    return "Exercise";
  }

  if (resource.resourceFormatLabel.toLowerCase() === "audio") {
    return "Practice tool";
  }

  return "Article";
}

function getUseCaseCategory(
  resource: ResourcesPageResource,
  primarySkillLabel: string | null,
) {
  const title = resource.title.toLowerCase();

  if (title.includes("dictionary")) {
    return "Word lookup";
  }

  if (primarySkillLabel === "Listening") {
    return "Listening input";
  }

  if (title.includes("grammar") || primarySkillLabel === "Grammar") {
    return resource.isFeatured ? "Daily practice" : "Grammar repair";
  }

  if (resource.primaryUseCaseLabel.toLowerCase() === "review") {
    return "Review";
  }

  if (resource.isFeatured || getResourceRoleValue(resource) === "core") {
    return "First resource";
  }

  return "Daily practice";
}

function buildHowToUseSteps(
  resource: ResourcesPageResource,
  primarySkillLabel: string | null,
) {
  return [
    `Start with one short ${resource.resourceFormatLabel.toLowerCase()} session connected to your current roadmap step.`,
    primarySkillLabel
      ? `Capture one pattern that supports ${primarySkillLabel.toLowerCase()} before you leave the page.`
      : "Capture one pattern, sentence, or example before you leave the page.",
    resource.bestUseCase,
    resource.followUpHint ??
      "Mark the resource useful or difficult, then return to the linked roadmap step.",
  ];
}

function getLevelTags(cefrLabel: string | null) {
  if (!cefrLabel) {
    return [];
  }

  return Array.from(new Set(cefrLabel.match(/Pre-A1|A1|A2|B1|B2|C1|C2/g) ?? []));
}

function matchesStateFilter(resource: LibraryResource, stateFilter: ResourceStateFilter) {
  if (stateFilter === "all") {
    return true;
  }

  if (stateFilter === "useful") {
    return resource.signal.isUseful;
  }

  if (stateFilter === "difficult") {
    return resource.signal.isDifficult;
  }

  return resource.signal.state === stateFilter;
}

function topCounts(values: string[], limit: number) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([value]) => value);
}

function getSignalTimestamp(value: number | undefined, resetTimestamp: number) {
  if (!value || value <= resetTimestamp) {
    return 0;
  }

  return value;
}

function getRoadmapLabel(linkedBlocks: LinkedBlock[]) {
  const priorityBlock = getPriorityLinkedBlock(linkedBlocks);

  if (!priorityBlock) {
    return "Connected to your roadmap";
  }

  return `${priorityBlock.stageTitle} / ${priorityBlock.title}`;
}

function getPriorityLinkedBlock(linkedBlocks: LinkedBlock[]) {
  return (
    linkedBlocks.find((block) => block.state === "in_progress") ??
    linkedBlocks.find((block) => block.state === "not_started") ??
    linkedBlocks[0]
  );
}

function getResourceRoleValue(resource: ResourcesPageResource): ResourceRoleOption {
  const roles = resource.roadmapLinks.map((link) => normalizeRole(link.role));

  if (roles.includes("core")) {
    return "core";
  }

  if (roles.includes("supporting")) {
    return "supporting";
  }

  return "optional";
}

function qualifiesForNeedsReviewShelf(resource: LibraryResource) {
  return resource.signal.state === "needs_review";
}

function qualifiesForUsefulShelf(resource: LibraryResource) {
  return resource.signal.isUseful && resource.signal.state !== "needs_review";
}

function qualifiesForRecentlyUsedShelf(resource: LibraryResource) {
  return (
    resource.signal.lastTouchedAt > 0 &&
    resource.signal.state !== "in_progress" &&
    resource.signal.state !== "needs_review" &&
    !resource.signal.isUseful
  );
}

function normalizeRole(role: ResourcesPageResource["roadmapLinks"][number]["role"]): ResourceRoleOption {
  if (role === "stretch") {
    return "optional";
  }

  return role;
}

function humanizeLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
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

function getLevelRank(level: string | undefined) {
  const order = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
  return Math.max(0, order.indexOf(level ?? "A1"));
}

function formatActionError(action: ResourcePrimaryAction, err: unknown): string {
  const actionLabels: Record<ResourcePrimaryAction, string> = {
    start: "starting",
    complete: "completing",
    useful: "marking as useful",
    difficult: "marking as difficult",
    review: "adding to review",
    skip: "skipping",
    reset: "resetting",
  };
  const base = `Something went wrong while ${actionLabels[action]} the resource`;

  if (err instanceof Error) {
    if (err.name === "AbortError") {
      return `${base} — the operation was aborted. Try again.`;
    }
    if (err.name === "QuotaExceededError") {
      return `${base} — storage is full. Free up space and try again.`;
    }
    if (err.message) {
      return `${base}: ${err.message}`;
    }
  }

  return `${base}. Please try again.`;
}

function normalizeForSearch(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function syncSearchParam(searchParams: URLSearchParams, key: string, value: string) {
  if (!value || value === "all") {
    searchParams.delete(key);
    return;
  }

  searchParams.set(key, value);
}

function getEntryState(entry: ProgressEntry | undefined): NormalizedProgressState {
  if (!entry) {
    return "not_started";
  }

  if (entry.state === "difficult") {
    return "needs_review";
  }

  return entry.state as NormalizedProgressState;
}
