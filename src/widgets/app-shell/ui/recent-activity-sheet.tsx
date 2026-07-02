"use client";

import { Activity } from "lucide-react";

import { useLearningEvents } from "@/shared/hooks/use-learning-events";
import { MobileSheet } from "@/shared/ui/mobile-sheet";

type RecentActivitySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EVENT_LABELS: Record<string, string> = {
  resource_started: "Started resource",
  resource_completed: "Completed resource",
  resource_marked_useful: "Marked useful",
  resource_marked_difficult: "Flagged difficult",
  resource_reset: "Reset resource",
  block_started: "Started block",
  block_completed: "Completed block",
  review_done: "Reviewed",
  writing_submitted: "Submitted writing",
  speaking_recorded: "Recorded speaking session",
  item_skipped: "Skipped item",
};

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type EventLike = {
  type: string;
  payload: {
    resourceTitle?: string;
    blockLabel?: string;
    wordCount?: number;
    durationSeconds?: number;
    reviewItemId?: string;
    itemId?: string;
  };
};

function describeEvent(event: EventLike): string {
  const label = EVENT_LABELS[event.type] ?? event.type;
  const subject =
    event.payload.resourceTitle ??
    event.payload.blockLabel ??
    event.payload.itemId ??
    event.payload.reviewItemId ??
    "activity";
  if (event.type === "writing_submitted" && event.payload.wordCount) {
    return `${label}: ${subject} (${event.payload.wordCount} words)`;
  }
  if (event.type === "speaking_recorded" && event.payload.durationSeconds) {
    return `${label}: ${subject} (${Math.round(event.payload.durationSeconds / 60)} min)`;
  }
  return `${label}: ${subject}`;
}

export function RecentActivitySheet({ open, onOpenChange }: RecentActivitySheetProps) {
  const { events, isLoading } = useLearningEvents(5);

  return (
    <MobileSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Recent activity"
      description="Your last few learning events on this device"
    >
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Your activity will appear here after you begin using English OS.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-3 rounded-[1.2rem] border border-surface-stroke bg-surface-panel-muted/50 px-4 py-3"
            >
              <div className="flex items-start gap-2 min-w-0">
                <Activity className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <p className="text-sm text-foreground min-w-0">
                  {describeEvent(event as EventLike)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </MobileSheet>
  );
}
