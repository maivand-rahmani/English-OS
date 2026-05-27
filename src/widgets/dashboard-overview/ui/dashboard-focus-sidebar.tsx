import type { BlockState, ProgressEntry } from "@/shared/types";

import type {
  ResourceWithContext,
  ReviewPreviewItem,
} from "../model/dashboard-overview-types";

import { DashboardResourceSection } from "./dashboard-resource-section";
import { DashboardReviewSection } from "./dashboard-review-section";

type DashboardFocusSidebarProps = {
  busyAction: string | null;
  focusBlockState: BlockState;
  focusResource: ResourceWithContext | null;
  focusResourceEntry: ProgressEntry | undefined;
  reviewHeadline: string;
  reviewPreviewItems: ReviewPreviewItem[];
  onCompleteResource: (resource: ResourceWithContext) => void;
  onMarkResourceDifficult: (resource: ResourceWithContext) => void;
  onStartResource: (resource: ResourceWithContext) => void;
};

export function DashboardFocusSidebar({
  busyAction,
  focusBlockState,
  focusResource,
  focusResourceEntry,
  reviewHeadline,
  reviewPreviewItems,
  onCompleteResource,
  onMarkResourceDifficult,
  onStartResource,
}: DashboardFocusSidebarProps) {
  return (
    <div className="space-y-[var(--layout-gap)]">
      <DashboardResourceSection
        busyAction={busyAction}
        focusBlockState={focusBlockState}
        focusResource={focusResource}
        focusResourceEntry={focusResourceEntry}
        onCompleteResource={onCompleteResource}
        onMarkResourceDifficult={onMarkResourceDifficult}
        onStartResource={onStartResource}
      />
      <DashboardReviewSection
        reviewHeadline={reviewHeadline}
        reviewPreviewItems={reviewPreviewItems}
      />
    </div>
  );
}
