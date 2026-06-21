import { RotateCcw } from "lucide-react";

import { DashboardCard, SectionEyebrow, SmallTag } from "@/shared/ui/surfaces";

import type { ReviewPreviewItem } from "../model/dashboard-overview-types";

type DashboardReviewSectionProps = {
  reviewHeadline: string;
  reviewPreviewItems: ReviewPreviewItem[];
};

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
                <SmallTag className="shrink-0">{item.urgency}</SmallTag>
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
