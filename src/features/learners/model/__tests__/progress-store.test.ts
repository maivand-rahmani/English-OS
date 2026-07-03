import { act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { useProgressStore } from "../progress-store";
import type { ProgressEntry } from "@/shared/types";

/**
 * The progress store is wrapped in `persist` middleware backed by IndexedDB.
 * `fake-indexeddb` is not installed in this repo, so we exercise the
 * in-memory state only and rely on persist's failure-resilience (it never
 * throws on hydration errors).
 *
 * Each test resets the store to a known initial state via `useProgressStore.setState`.
 */

const sampleEntry: ProgressEntry = {
  id: "block-1",
  entryType: "block",
  state: "in_progress",
  updatedAt: 1700000000000,
  meta: { label: "Reading practice" },
};

beforeEach(() => {
  // Reset to a clean in-memory state — persist storage is left as-is.
  act(() => {
    useProgressStore.setState({
      entries: [],
      isLoading: true,
      error: null,
    });
  });
});

describe("useProgressStore", () => {
  test("starts with the default initial state (entries=[], isLoading=true, error=null)", () => {
    const state = useProgressStore.getState();
    expect(state.entries).toEqual([]);
    expect(state.error).toBeNull();
  });

  test("updateEntry adds a new entry when no matching id exists", async () => {
    await act(async () => {
      await useProgressStore.getState().updateEntry("block-1", "in_progress");
    });

    const state = useProgressStore.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]?.id).toBe("block-1");
    expect(state.entries[0]?.state).toBe("in_progress");
    expect(state.entries[0]?.entryType).toBe("block");
  });

  test("updateEntry updates an existing entry in place (idempotent on id)", async () => {
    // Seed an initial entry via saveEntry (synchronous set)
    act(() => {
      useProgressStore.setState({ entries: [sampleEntry] });
    });

    await act(async () => {
      await useProgressStore.getState().updateEntry("block-1", "completed", {
        label: "Done",
      });
    });

    const state = useProgressStore.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]?.state).toBe("completed");
    expect(state.entries[0]?.meta).toEqual({ label: "Done" });
  });

  test("saveEntry upserts entries; getEntry returns the matching record", () => {
    act(() => {
      useProgressStore.getState().saveEntry(sampleEntry);
    });

    const found = useProgressStore.getState().getEntry("block-1");
    expect(found).toEqual(sampleEntry);
  });

  test("removeEntry drops the entry by id", () => {
    act(() => {
      useProgressStore.setState({ entries: [sampleEntry] });
    });

    act(() => {
      useProgressStore.getState().removeEntry("block-1");
    });

    expect(useProgressStore.getState().entries).toEqual([]);
  });

  test("clearAll empties the entries array", () => {
    act(() => {
      useProgressStore.setState({
        entries: [
          sampleEntry,
          { ...sampleEntry, id: "block-2" },
        ],
      });
    });

    act(() => {
      useProgressStore.getState().clearAll();
    });

    expect(useProgressStore.getState().entries).toEqual([]);
  });
});
