import { create } from "zustand";

/**
 * Filter state for the Resources Library.
 *
 * URL search params are the **source of truth** — the store mirrors URL on
 * mount (`hydrateFromUrl`) and pushes changes back via `window.history.replaceState`
 * (debounced 200ms). Does NOT use `persist` middleware.
 *
 * URL key mapping:
 * | State key | URL param |
 * |-----------|-----------|
 * | `query`   | `q`       |
 * | `skill`   | `skill`   |
 * | `level`   | `level`   |
 * | `format`  | `format`  |
 * | `use`     | `use`     |
 * | `state`   | `state`   |
 * | `role`    | `role`    |
 */
export type FiltersState = {
  query: string;
  skill: string | null;
  level: string | null;
  format: string | null;
  use: string | null;
  state: string | null;
  role: string | null;
};

type FiltersActions = {
  setFilter: <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => void;
  setFilters: (partial: Partial<FiltersState>) => void;
  resetFilters: () => void;
  hydrateFromUrl: (searchParams: URLSearchParams) => void;
  toUrlSearchParams: () => URLSearchParams;
};

type FiltersStore = FiltersState & FiltersActions;

const DEFAULT_STATE: FiltersState = {
  query: "",
  skill: null,
  level: null,
  format: null,
  use: null,
  state: null,
  role: null,
};

const STATE_TO_URL: Record<keyof FiltersState, string> = {
  query: "q",
  skill: "skill",
  level: "level",
  format: "format",
  use: "use",
  state: "state",
  role: "role",
};

const URL_TO_STATE: Record<string, keyof FiltersState> = {
  q: "query",
  skill: "skill",
  level: "level",
  format: "format",
  use: "use",
  state: "state",
  role: "role",
};

export const useFiltersStore = create<FiltersStore>()((set, get) => ({
  ...DEFAULT_STATE,

  setFilter: (key, value) => set({ [key]: value }),

  setFilters: (partial) => set(partial),

  resetFilters: () => set({ ...DEFAULT_STATE }),

  hydrateFromUrl: (searchParams) => {
    const next: Partial<FiltersState> = {};

    for (const [urlKey, stateKey] of Object.entries(URL_TO_STATE)) {
      const value = searchParams.get(urlKey);
      if (stateKey === "query") {
        next[stateKey] = value ?? "";
      } else {
        (next as Record<string, string | null>)[stateKey] = value;
      }
    }

    set(next);
  },

  toUrlSearchParams: () => {
    const state = get();
    const params = new URLSearchParams();

    for (const [stateKey, urlKey] of Object.entries(STATE_TO_URL)) {
      const value = state[stateKey as keyof FiltersState];
      if (value) {
        params.set(urlKey, value);
      }
    }

    return params;
  },
}));

// URL sync — debounced window.history.replaceState

if (typeof window !== "undefined") {
  let syncTimer: ReturnType<typeof setTimeout> | undefined;

  useFiltersStore.subscribe((state) => {
    clearTimeout(syncTimer);

    syncTimer = setTimeout(() => {
      const params = state.toUrlSearchParams();
      const searchString = params.toString();
      const newUrl = searchString
        ? `${window.location.pathname}?${searchString}`
        : window.location.pathname;

      window.history.replaceState(null, "", newUrl);
    }, 200);
  });
}
