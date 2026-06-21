import { Circle, RotateCcw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { DashboardCard, SectionEyebrow, SmallTag } from "@/shared/ui/surfaces";

import type { ReviewPreviewItem } from "../model/dashboard-overview-types";

type DashboardReviewSectionProps = {
  reviewHeadline: string;
  reviewPreviewItems: ReviewPreviewItem[];
};

function urgencyColor(urgencyCategory?: string): string {
  switch (urgencyCategory) {
    case "overdue":
      return "text-red-500";
    case "due_soon":
      return "text-amber-500";
    case "flagged":
      return "text-blue-500";
    case "neglected":
      return "text-gray-400";
    default:
      return "text-muted-foreground";
  }
}

function urgencyTagColor(urgencyCategory?: string): string {
  switch (urgencyCategory) {
    case "overdue":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300";
    case "due_soon":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300";
    case "flagged":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "neglected":
      return "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400";
    default:
      return "";
  }
}

export function DashboardReviewSection({
  reviewHeadline,
  reviewPreviewItems,
}: DashboardReviewSectionProps) {
  return (
    <DashboardCard className="bg-surface-panel-muted p-5 hover:translate-y-0 hover:shadow-none">
      <SectionEyebrow icon={RotateCcw}>Review preview</SectionEyebrow>

      {reviewHeadline ? (
        <p className="mt-3 text-sm text-muted-foreground">{reviewHeadline}</p>
      ) : null}

      <div className="mt-4 grid gap-2.5">
        {reviewPreviewItems.length > 0 ? (
          reviewPreviewItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-[1.2rem] border border-surface-stroke bg-surface-panel-muted/50 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Circle
                    className={cn(
                      "mt-0.5 size-2.5 shrink-0 fill-current",
                      urgencyColor(item.urgencyCategory),
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    {item.context ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.context}
                      </p>
                    ) : null}
                  </div>
                </div>
                {item.urgencyCategory ? (
                  <SmallTag className={cn("shrink-0", urgencyTagColor(item.urgencyCategory))}>
                    {item.urgency}
                  </SmallTag>
                ) : (
                  <SmallTag className="shrink-0">{item.urgency}</SmallTag>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Review pressure will appear here when you mark a block or resource
            difficult, skip something, or explicitly set it to needs review.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
