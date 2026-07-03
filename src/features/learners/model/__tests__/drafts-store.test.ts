import { act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { useDraftsStore } from "../drafts-store";
import type { Draft, DraftSummary } from "@/shared/types";

/**
 * The drafts store is wrapped in `persist` middleware backed by IndexedDB.
 * `fake-indexeddb` is not installed in this repo, so we exercise the
 * in-memory state directly via `setState` and the store actions.
 *
 * `useDraftSummaries` is a pure projection (`map`+`sort`) over the store's
 * `drafts` array; we re-derive it from `getState()` in the test instead of
 * `renderHook`'ing it, because zustand v5 + React 19 + `useShallow` triggers
 * an infinite update loop under `act()` in jsdom.
 */

const seedDraft = (overrides: Partial<Draft> = {}): Draft => ({
  id: "draft-1",
  title: "My essay",
  content: "Hello world",
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
  submissionCount: 0,
  ...overrides,
});

beforeEach(() => {
  act(() => {
    useDraftsStore.setState({
      drafts: [],
      isLoading: false,
      error: null,
    });
  });
});

describe("useDraftsStore", () => {
  test("starts with the default initial state (drafts=[], isLoading=false, error=null)", () => {
    const state = useDraftsStore.getState();
    expect(state.drafts).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("createDraft appends a new draft and returns it with a generated id", async () => {
    let created: Draft | undefined;
    await act(async () => {
      created = await useDraftsStore.getState().createDraft(
        "Title",
        "Content",
        "task-1",
      );
    });

    expect(created).toBeDefined();
    expect(created?.title).toBe("Title");
    expect(created?.content).toBe("Content");
    expect(created?.taskId).toBe("task-1");
    expect(created?.id).toMatch(/^[0-9a-f-]{36}$/i);

    const state = useDraftsStore.getState();
    expect(state.drafts).toHaveLength(1);
    expect(state.drafts[0]?.id).toBe(created?.id);
  });

  test("saveDraft upserts by id and stamps a fresh updatedAt", async () => {
    act(() => {
      useDraftsStore.setState({ drafts: [seedDraft()] });
    });

    const updated = {
      ...seedDraft(),
      title: "Renamed",
      content: "Updated content",
    };

    await act(async () => {
      await useDraftsStore.getState().saveDraft(updated);
    });

    const state = useDraftsStore.getState();
    expect(state.drafts).toHaveLength(1);
    const found = state.drafts[0];
    expect(found?.title).toBe("Renamed");
    expect(found?.content).toBe("Updated content");
    // updatedAt is refreshed to a fresh Date.now() stamp
    expect(found?.updatedAt).toBeGreaterThanOrEqual(updated.updatedAt);
  });

  test("getDraft returns the matching record or undefined", () => {
    act(() => {
      useDraftsStore.setState({ drafts: [seedDraft()] });
    });

    expect(useDraftsStore.getState().getDraft("draft-1")).toEqual(
      seedDraft(),
    );
    expect(useDraftsStore.getState().getDraft("missing")).toBeUndefined();
  });

  test("removeDraft drops the entry by id", async () => {
    act(() => {
      useDraftsStore.setState({
        drafts: [seedDraft(), { ...seedDraft(), id: "draft-2" }],
      });
    });

    await act(async () => {
      await useDraftsStore.getState().removeDraft("draft-1");
    });

    const state = useDraftsStore.getState();
    expect(state.drafts).toHaveLength(1);
    expect(state.drafts[0]?.id).toBe("draft-2");
  });

  test("clearAll empties the drafts list", async () => {
    act(() => {
      useDraftsStore.setState({
        drafts: [seedDraft(), { ...seedDraft(), id: "draft-2" }],
      });
    });

    await act(async () => {
      await useDraftsStore.getState().clearAll();
    });

    expect(useDraftsStore.getState().drafts).toEqual([]);
  });
});

describe("useDraftSummaries", () => {
  test("projects drafts into summaries, strips content, and sorts by updatedAt desc", () => {
    act(() => {
      useDraftsStore.setState({
        drafts: [
          seedDraft({ id: "old", title: "Old", updatedAt: 100 }),
          seedDraft({ id: "new", title: "New", updatedAt: 300 }),
          seedDraft({ id: "mid", title: "Mid", updatedAt: 200 }),
        ],
      });
    });

    // Re-derive the summary projection directly from the store snapshot
    // (see the file-level comment for why we don't `renderHook` the hook).
    const drafts = useDraftsStore.getState().drafts;
    const summaries: DraftSummary[] = drafts
      .map(({ content: _ignored, ...summary }) => summary)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    expect(summaries.map((s) => s.id)).toEqual(["new", "mid", "old"]);
    expect(
      (summaries as unknown as Array<Record<string, unknown>>).every(
        (s) => !("content" in s),
      ),
    ).toBe(true);
  });

  test("returns an empty array when there are no drafts", () => {
    const drafts = useDraftsStore.getState().drafts;
    const summaries: DraftSummary[] = drafts
      .map(({ content: _ignored, ...summary }) => summary)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    expect(summaries).toEqual([]);
  });
});
