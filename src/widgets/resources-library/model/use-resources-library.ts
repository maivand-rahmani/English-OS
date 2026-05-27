"use client";

import { useState } from "react";

import type { DashboardContentState } from "@/entities/dashboard";
import { useLearningContentProgress } from "@/shared/hooks";
import type { ProgressEntry } from "@/shared/types";

type LinkedBlock = {
  id: string;
  slug: string;
  title: string;
  stageTitle: string;
};

type LibraryResource = DashboardContentState["stages"][number]["blocks"][number]["resources"][number] & {
  linkedBlocks: LinkedBlock[];
  isFeatured: boolean;
  url: string;
  description: string | null;
  accessTypeLabel: string;
  difficultyLabel: string;
  cefrLabel: string | null;
};

export function useResourcesLibrary(content: DashboardContentState) {
  const progress = useLearningContentProgress(16);
  const [skillFilter, setSkillFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [useCaseFilter, setUseCaseFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const progressById = new Map(progress.entries.map((entry) => [entry.id, entry]));
  const resources = buildResourceCollection(content);
  const skillOptions = uniqueValues(resources.flatMap((resource) => resource.skills.map((skill) => skill.title)));
  const formatOptions = uniqueValues(resources.map((resource) => resource.resourceFormatLabel));
  const useCaseOptions = uniqueValues(resources.map((resource) => resource.primaryUseCaseLabel));

  const filteredResources = resources.filter((resource) => {
    const resourceState = getEntryState(progressById.get(resource.id));

    if (
      skillFilter !== "all" &&
      !resource.skills.some((skill) => skill.title === skillFilter)
    ) {
      return false;
    }

    if (formatFilter !== "all" && resource.resourceFormatLabel !== formatFilter) {
      return false;
    }

    if (useCaseFilter !== "all" && resource.primaryUseCaseLabel !== useCaseFilter) {
      return false;
    }

    if (stateFilter !== "all" && resourceState !== stateFilter) {
      return false;
    }

    return true;
  });

  const featuredCount = resources.filter((resource) => resource.isFeatured).length;
  const completedCount = resources.filter(
    (resource) => getEntryState(progressById.get(resource.id)) === "completed",
  ).length;
  const activeResource =
    resources.find((resource) => getEntryState(progressById.get(resource.id)) === "in_progress") ??
    resources[0] ??
    null;

  return {
    activeResource,
    busyAction: progress.busyAction,
    completedCount,
    featuredCount,
    filteredResources,
    formatFilter,
    formatOptions,
    isLoading: progress.isLoading,
    progressById,
    resources,
    setFormatFilter,
    setSkillFilter,
    setStateFilter,
    setUseCaseFilter,
    skillFilter,
    skillOptions,
    stateFilter,
    updateResourceState: progress.updateResourceState,
    useCaseFilter,
    useCaseOptions,
  } as const;
}

function buildResourceCollection(content: DashboardContentState) {
  const resources = new Map<string, LibraryResource>();

  for (const stage of content.stages) {
    for (const block of stage.blocks) {
      for (const resource of block.resources) {
        const existing = resources.get(resource.id);
        const linkedBlock = {
          id: block.id,
          slug: block.slug,
          title: block.title,
          stageTitle: stage.title,
        };

        if (existing) {
          existing.linkedBlocks.push(linkedBlock);
          continue;
        }

        resources.set(resource.id, {
          ...resource,
          linkedBlocks: [linkedBlock],
        });
      }
    }
  }

  return [...resources.values()].sort((left, right) => {
    if (left.isFeatured !== right.isFeatured) {
      return left.isFeatured ? -1 : 1;
    }

    if (left.role !== right.role) {
      return left.role === "core" ? -1 : 1;
    }

    return left.title.localeCompare(right.title);
  });
}

function uniqueValues(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function getEntryState(entry: ProgressEntry | undefined) {
  return entry?.state ?? "not_started";
}
