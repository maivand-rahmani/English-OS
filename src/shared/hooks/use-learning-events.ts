"use client";

import { useCallback, useEffect, useState } from "react";

import { appendEvent, getEvents } from "@/shared/persistence";
import type { LearningEvent, LearningEventType } from "@/shared/types";

/**
 * Creates a learning event (without id/timestamp/synced — those are
 * filled in automatically).
 */
export type EventInput = {
  type: LearningEventType;
  payload: LearningEvent["payload"];
};

/**
 * Hook for recording and reading local learning events.
 *
 * Events are immediately persisted to IndexedDB. The `events` list
 * is refreshed on mount and after each `recordEvent` call.
 */
export function useLearningEvents(limit = 50) {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await getEvents({ limit, order: "desc" });
      setEvents(result);
    } catch (error) {
      console.error("Failed to load learning events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // Load on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordEvent = useCallback(
    async (input: EventInput) => {
      const event: LearningEvent = {
        id: crypto.randomUUID(),
        type: input.type,
        timestamp: Date.now(),
        payload: input.payload,
        synced: false,
      } as LearningEvent;

      try {
        await appendEvent(event);
        setEvents((prev) => [event, ...prev].slice(0, limit));
      } catch (error) {
        console.error("Failed to record learning event:", error);
      }
    },
    [limit]
  );

  return {
    events,
    isLoading,
    recordEvent,
    refresh,
  } as const;
}
