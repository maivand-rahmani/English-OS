import { act } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import { useFiltersStore } from "../filters-store";

/**
 * The filters store subscribes to its own state on module load and pushes
 * changes to `window.history.replaceState` with a 200ms debounce. We use
 * vitest's fake timers to control that timer deterministically and stub
 * `history.replaceState` so we can observe the URL writes.
 */

const replaceStateSpy = vi.fn();
const originalReplaceState = window.history.replaceState;

beforeEach(() => {
  vi.useFakeTimers();
  replaceStateSpy.mockClear();
  window.history.replaceState = replaceStateSpy as typeof window.history.replaceState;
  act(() => {
    useFiltersStore.setState({
      query: "",
      skill: null,
      level: null,
      format: null,
      use: null,
      state: null,
      role: null,
    });
  });
});

afterEach(() => {
  vi.useRealTimers();
  window.history.replaceState = originalReplaceState;
});

describe("useFiltersStore", () => {
  test("starts with the default filter state (empty query, all filters null)", () => {
    const state = useFiltersStore.getState();
    expect(state.query).toBe("");
    expect(state.skill).toBeNull();
    expect(state.level).toBeNull();
    expect(state.format).toBeNull();
    expect(state.use).toBeNull();
    expect(state.state).toBeNull();
    expect(state.role).toBeNull();
  });

  test("setFilter updates a single filter key without touching the others", () => {
    act(() => {
      useFiltersStore.getState().setFilter("skill", "reading");
    });
    const state = useFiltersStore.getState();
    expect(state.skill).toBe("reading");
    expect(state.level).toBeNull();
  });

  test("setFilters applies a partial update in a single call", () => {
    act(() => {
      useFiltersStore.getState().setFilters({
        level: "B1",
        format: "video",
      });
    });
    const state = useFiltersStore.getState();
    expect(state.level).toBe("B1");
    expect(state.format).toBe("video");
  });

  test("resetFilters returns all keys to the default state", () => {
    act(() => {
      useFiltersStore.getState().setFilters({
        query: "phonics",
        skill: "reading",
        level: "B1",
      });
    });

    act(() => {
      useFiltersStore.getState().resetFilters();
    });

    const state = useFiltersStore.getState();
    expect(state.query).toBe("");
    expect(state.skill).toBeNull();
    expect(state.level).toBeNull();
  });

  test("hydrateFromUrl populates state from URLSearchParams", () => {
    act(() => {
      useFiltersStore.getState().hydrateFromUrl(
        new URLSearchParams({
          q: "verbs",
          skill: "grammar",
          level: "A2",
        }),
      );
    });

    const state = useFiltersStore.getState();
    expect(state.query).toBe("verbs");
    expect(state.skill).toBe("grammar");
    expect(state.level).toBe("A2");
  });

  test("toUrlSearchParams projects state back into URLSearchParams", () => {
    act(() => {
      useFiltersStore.getState().setFilters({
        query: "past tense",
        level: "B2",
        format: "audio",
      });
    });

    const params = useFiltersStore.getState().toUrlSearchParams();
    expect(params.get("q")).toBe("past tense");
    expect(params.get("level")).toBe("B2");
    expect(params.get("format")).toBe("audio");
    expect(params.get("skill")).toBeNull();
  });

  test("store mutations debounce a window.history.replaceState call", () => {
    act(() => {
      useFiltersStore.getState().setFilter("skill", "speaking");
    });
    // Before the debounce fires, no history update has happened.
    expect(replaceStateSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    const [, , url] = replaceStateSpy.mock.calls[0] as [null, string, string];
    expect(url).toContain("skill=speaking");
  });
});
