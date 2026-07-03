/**
 * Type-safe factory for TanStack Query keys.
 *
 * Convention: [namespace, entity?, ...args]
 * - namespace: plural lowercase noun
 * - entity: singular lowercase noun
 * - args: stable, serializable values only (id, filter hash)
 *
 * Use `queryKeys.learners.all` for prefix invalidation:
 *   `queryClient.invalidateQueries({ queryKey: queryKeys.learners.all })`
 */

export type ResourcesFilters = Record<string, string | undefined>;

export const queryKeys = {
  learners: {
    all: ["learners"] as const,
    profile: () => [...queryKeys.learners.all, "profile"] as const,
    profileDetail: (id: string) =>
      [...queryKeys.learners.profile(), "detail", id] as const,
    progress: () => [...queryKeys.learners.all, "progress"] as const,
    drafts: () => [...queryKeys.learners.all, "drafts"] as const,
    events: () => [...queryKeys.learners.all, "events"] as const,
  },

  ai: {
    all: ["ai"] as const,
    writing: {
      feedback: () => [...queryKeys.ai.all, "writing", "feedback"] as const,
    },
    speaking: {
      feedback: () => [...queryKeys.ai.all, "speaking", "feedback"] as const,
    },
    recommendation: {
      explain: (recId: string) =>
        [...queryKeys.ai.all, "recommendation", "explain", recId] as const,
    },
  },

  dashboard: {
    all: ["dashboard"] as const,
    state: () => [...queryKeys.dashboard.all, "state"] as const,
  },

  resources: {
    all: ["resources"] as const,
    list: (filters: ResourcesFilters) =>
      [...queryKeys.resources.all, "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.resources.all, "detail", id] as const,
  },
} as const;
