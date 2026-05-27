import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { DashboardCard, SectionEyebrow } from "@/shared/ui/surfaces";

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
    <DashboardCard className="p-5">
      <SectionEyebrow icon={RotateCcw}>Review preview</SectionEyebrow>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground">
            {reviewPreviewItems.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{reviewHeadline}</p>
        </div>
        <Link
          href="/roadmap"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full rounded-full px-3 text-foreground hover:bg-black/5 sm:w-auto",
          )}
        >
          Open roadmap
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {reviewPreviewItems.length > 0 ? (
          reviewPreviewItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-[1.2rem] border border-white/70 bg-surface-2 px-4 py-3"
            >
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.context}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.urgency}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-black/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
            Review pressure will appear here when you mark a block or resource
            difficult, skip something, or explicitly set it to needs review.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
