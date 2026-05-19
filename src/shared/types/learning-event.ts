export const LearningEventType = {
  ResourceStarted: "resource_started",
  ResourceCompleted: "resource_completed",
  ResourceMarkedDifficult: "resource_marked_difficult",
  BlockStarted: "block_started",
  BlockCompleted: "block_completed",
  ReviewDone: "review_done",
  WritingSubmitted: "writing_submitted",
  SpeakingRecorded: "speaking_recorded",
  ItemSkipped: "item_skipped",
} as const;

export type LearningEventType =
  (typeof LearningEventType)[keyof typeof LearningEventType];

export type ResourceStartedPayload = {
  resourceId: string;
  resourceTitle: string;
};

export type ResourceCompletedPayload = {
  resourceId: string;
  resourceTitle: string;
  reflection?: "easy" | "hard" | "useful" | "confusing";
};

export type ResourceMarkedDifficultPayload = {
  resourceId: string;
  resourceTitle: string;
  reason?: string;
};

export type BlockStartedPayload = {
  blockId: string;
  blockLabel: string;
  stageId?: string;
};

export type BlockCompletedPayload = {
  blockId: string;
  blockLabel: string;
  stageId?: string;
};

export type ReviewDonePayload = {
  reviewItemId: string;
  sourceType: "resource" | "block" | "writing_mistake" | "speaking_pattern";
  outcome: "clear" | "still_difficult" | "deferred";
};

export type WritingSubmittedPayload = {
  draftId: string;
  taskId?: string;
  wordCount: number;
};

export type SpeakingRecordedPayload = {
  sessionId: string;
  promptId?: string;
  durationSeconds: number;
};

export type ItemSkippedPayload = {
  itemId: string;
  itemType: "resource" | "block" | "review" | "task";
  reason?: string;
};

export type ResourceStartedEvent = {
  id: string;
  type: typeof LearningEventType.ResourceStarted;
  timestamp: number;
  payload: ResourceStartedPayload;
  synced: boolean;
};

export type ResourceCompletedEvent = {
  id: string;
  type: typeof LearningEventType.ResourceCompleted;
  timestamp: number;
  payload: ResourceCompletedPayload;
  synced: boolean;
};

export type ResourceMarkedDifficultEvent = {
  id: string;
  type: typeof LearningEventType.ResourceMarkedDifficult;
  timestamp: number;
  payload: ResourceMarkedDifficultPayload;
  synced: boolean;
};

export type BlockStartedEvent = {
  id: string;
  type: typeof LearningEventType.BlockStarted;
  timestamp: number;
  payload: BlockStartedPayload;
  synced: boolean;
};

export type BlockCompletedEvent = {
  id: string;
  type: typeof LearningEventType.BlockCompleted;
  timestamp: number;
  payload: BlockCompletedPayload;
  synced: boolean;
};

export type ReviewDoneEvent = {
  id: string;
  type: typeof LearningEventType.ReviewDone;
  timestamp: number;
  payload: ReviewDonePayload;
  synced: boolean;
};

export type WritingSubmittedEvent = {
  id: string;
  type: typeof LearningEventType.WritingSubmitted;
  timestamp: number;
  payload: WritingSubmittedPayload;
  synced: boolean;
};

export type SpeakingRecordedEvent = {
  id: string;
  type: typeof LearningEventType.SpeakingRecorded;
  timestamp: number;
  payload: SpeakingRecordedPayload;
  synced: boolean;
};

export type ItemSkippedEvent = {
  id: string;
  type: typeof LearningEventType.ItemSkipped;
  timestamp: number;
  payload: ItemSkippedPayload;
  synced: boolean;
};

/** Discriminated union of all learning event types. */
export type LearningEvent =
  | ResourceStartedEvent
  | ResourceCompletedEvent
  | ResourceMarkedDifficultEvent
  | BlockStartedEvent
  | BlockCompletedEvent
  | ReviewDoneEvent
  | WritingSubmittedEvent
  | SpeakingRecordedEvent
  | ItemSkippedEvent;
