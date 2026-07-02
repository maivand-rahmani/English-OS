import { describe, expect, test } from "vitest";

import {
  LearningEventType,
  type LearningEvent,
} from "@/shared/types/learning-event";

import { getLatestEventTimestamp } from "./recommendation-helpers";

function makeWritingEvent(timestamp: number, id = `writing-${timestamp}`): LearningEvent {
  return {
    id,
    type: LearningEventType.WritingSubmitted,
    timestamp,
    payload: { draftId: id, wordCount: 100 },
    synced: false,
  };
}

function makeSpeakingEvent(timestamp: number, id = `speaking-${timestamp}`): LearningEvent {
  return {
    id,
    type: LearningEventType.SpeakingRecorded,
    timestamp,
    payload: { sessionId: id, durationSeconds: 30 },
    synced: false,
  };
}

function makeResourceStartedEvent(timestamp: number, id = `resource-${timestamp}`): LearningEvent {
  return {
    id,
    type: LearningEventType.ResourceStarted,
    timestamp,
    payload: { resourceId: id, resourceTitle: "Test Resource" },
    synced: false,
  };
}

function makeBlockCompletedEvent(timestamp: number, id = `block-${timestamp}`): LearningEvent {
  return {
    id,
    type: LearningEventType.BlockCompleted,
    timestamp,
    payload: { blockId: id, blockLabel: "Test Block" },
    synced: false,
  };
}

describe("getLatestEventTimestamp", () => {
  test("returns null for empty events array", () => {
    expect(getLatestEventTimestamp([], LearningEventType.WritingSubmitted)).toBeNull();
  });

  test("returns null when no event matches the type", () => {
    const events: LearningEvent[] = [
      makeResourceStartedEvent(1000),
      makeBlockCompletedEvent(2000),
    ];
    expect(getLatestEventTimestamp(events, LearningEventType.WritingSubmitted)).toBeNull();
  });

  test("returns the single matching timestamp", () => {
    const events: LearningEvent[] = [makeWritingEvent(5000)];
    expect(getLatestEventTimestamp(events, LearningEventType.WritingSubmitted)).toBe(5000);
  });

  test("returns the MAX timestamp when multiple events match (regression for 'find' bug)", () => {
    // With the old buggy `find` implementation, this would have returned 100
    // (the first match) rather than 300 (the actual latest writing event).
    const events: LearningEvent[] = [
      makeWritingEvent(100),
      makeSpeakingEvent(200),
      makeWritingEvent(300), // <-- latest writing
      makeSpeakingEvent(400),
      makeWritingEvent(250), // <-- older than 300
    ];
    expect(getLatestEventTimestamp(events, LearningEventType.WritingSubmitted)).toBe(300);
    expect(getLatestEventTimestamp(events, LearningEventType.SpeakingRecorded)).toBe(400);
  });

  test("returns the correct timestamp when events are out of order", () => {
    const events: LearningEvent[] = [
      makeWritingEvent(5000),
      makeWritingEvent(1000),
      makeWritingEvent(3000),
    ];
    expect(getLatestEventTimestamp(events, LearningEventType.WritingSubmitted)).toBe(5000);
  });

  test("handles equal timestamps deterministically", () => {
    const events: LearningEvent[] = [
      makeWritingEvent(1000, "a"),
      makeWritingEvent(1000, "b"),
    ];
    expect(getLatestEventTimestamp(events, LearningEventType.WritingSubmitted)).toBe(1000);
  });
});
