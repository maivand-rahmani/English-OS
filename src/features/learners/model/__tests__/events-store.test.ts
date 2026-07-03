import { act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { useEventsStore } from "../events-store";
import type { LearningEvent } from "@/shared/types";
import { LearningEventType } from "@/shared/types";

/**
 * The events store is wrapped in `persist` middleware backed by IndexedDB.
 * `fake-indexeddb` is not installed in this repo. We exercise the
 * in-memory state directly via `setState` and the store actions.
 * The in-memory state is reset between tests via `setState`.
 */

const seedEvent = (overrides: {
  id?: string;
  type?: LearningEventType;
  payload?: LearningEvent["payload"];
  timestamp?: number;
  synced?: boolean;
} = {}): LearningEvent => {
  const { type = LearningEventType.BlockStarted, payload = { blockId: "b1", blockLabel: "Block 1" }, ...rest } = overrides;
  return {
    id: "evt-1",
    timestamp: 1700000000000,
    synced: false,
    ...rest,
    type,
    payload,
  } as LearningEvent;
};

beforeEach(() => {
  act(() => {
    useEventsStore.setState({
      events: [],
      isLoading: true,
      error: null,
    });
  });
});

describe("useEventsStore", () => {
  test("starts with the default initial state (events=[], isLoading=true, error=null)", () => {
    const state = useEventsStore.getState();
    expect(state.events).toEqual([]);
    expect(state.error).toBeNull();
  });

  test("recordEvent appends a new event with synced=false and a generated id", async () => {
    await act(async () => {
      await useEventsStore.getState().recordEvent({
        type: LearningEventType.BlockStarted,
        payload: { blockId: "b1", blockLabel: "Block 1" },
      });
    });

    const state = useEventsStore.getState();
    expect(state.events).toHaveLength(1);
    const event = state.events[0];
    expect(event?.type).toBe(LearningEventType.BlockStarted);
    expect(event?.synced).toBe(false);
    expect(event?.id).toMatch(/^[0-9a-f-]{36}$/i);
  });

  test("recordEvent prepends new events so the most recent is first", async () => {
    await act(async () => {
      await useEventsStore.getState().recordEvent({
        type: LearningEventType.BlockStarted,
        payload: { blockId: "b1", blockLabel: "Block 1" },
      });
    });
    await act(async () => {
      await useEventsStore.getState().recordEvent({
        type: LearningEventType.BlockCompleted,
        payload: { blockId: "b1", blockLabel: "Block 1" },
      });
    });

    const state = useEventsStore.getState();
    expect(state.events).toHaveLength(2);
    expect(state.events[0]?.type).toBe(LearningEventType.BlockCompleted);
    expect(state.events[1]?.type).toBe(LearningEventType.BlockStarted);
  });

  test("getUnsyncedEvents returns only events with synced=false", () => {
    act(() => {
      useEventsStore.setState({
        events: [
          seedEvent({ id: "a", synced: false }),
          seedEvent({ id: "b", synced: true }),
          seedEvent({ id: "c", synced: false }),
        ],
      });
    });

    const unsynced = useEventsStore.getState().getUnsyncedEvents();
    expect(unsynced.map((e) => e.id)).toEqual(["a", "c"]);
  });

  test("markSynced flips matched events to synced=true", async () => {
    act(() => {
      useEventsStore.setState({
        events: [
          seedEvent({ id: "a", synced: false }),
          seedEvent({ id: "b", synced: false }),
        ],
      });
    });

    await act(async () => {
      await useEventsStore.getState().markSynced(["a"]);
    });

    const events = useEventsStore.getState().events;
    expect(events.find((e) => e.id === "a")?.synced).toBe(true);
    expect(events.find((e) => e.id === "b")?.synced).toBe(false);
  });

  test("getEventsByType filters by type and respects the optional limit", () => {
    act(() => {
      useEventsStore.setState({
        events: [
          seedEvent({ id: "a", type: LearningEventType.BlockStarted }),
          seedEvent({ id: "b", type: LearningEventType.BlockCompleted }),
          seedEvent({ id: "c", type: LearningEventType.BlockStarted }),
        ],
      });
    });

    const started = useEventsStore.getState().getEventsByType(
      LearningEventType.BlockStarted,
    );
    expect(started).toHaveLength(2);

    const limited = useEventsStore.getState().getEventsByType(
      LearningEventType.BlockStarted,
      1,
    );
    expect(limited).toHaveLength(1);
  });

  test("clearAll empties the events list and clears the error", async () => {
    act(() => {
      useEventsStore.setState({
        events: [seedEvent()],
        error: "previous error",
      });
    });

    await act(async () => {
      await useEventsStore.getState().clearAll();
    });

    expect(useEventsStore.getState().events).toEqual([]);
  });
});
