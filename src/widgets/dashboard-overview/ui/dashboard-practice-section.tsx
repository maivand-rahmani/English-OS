import Link from "next/link";
import { Mic, PenSquare, Sparkles } from "lucide-react";

import type { DraftSummary, LearningEvent } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

import type {
  SpeakingPromptWithContext,
  WritingTaskWithContext,
} from "../model/dashboard-overview-types";
import {
  formatRelativeTimestamp,
  getSpeakingStatus,
  getWritingStatus,
} from "../model/dashboard-overview-formatters";
import { DashboardCard, QuickActionCard, SectionEyebrow } from "@/shared/ui/surfaces";

type DashboardPracticeSectionProps = {
  draftCount: number;
  draftForWritingTask: DraftSummary | undefined;
  events: LearningEvent[];
  nextSpeakingPrompt: SpeakingPromptWithContext | null;
  nextWritingTask: WritingTaskWithContext | null;
};

export function DashboardPracticeSection({
  draftCount,
  draftForWritingTask,
  events,
  nextSpeakingPrompt,
  nextWritingTask,
}: DashboardPracticeSectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={Sparkles}>Practice</SectionEyebrow>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <QuickActionCard
          icon={PenSquare}
          title={nextWritingTask?.title ?? "Next writing task pending"}
          eyebrow="Writing"
          detail={
            draftForWritingTask
              ? `1 local draft is waiting for ${nextWritingTask?.blockTitle.toLowerCase()}.`
              : nextWritingTask?.summary ??
                "A guided writing task will appear here when the current block links one."
          }
          footer={
            draftForWritingTask
              ? `Draft updated ${formatRelativeTimestamp(draftForWritingTask.updatedAt)}`
              : getWritingStatus(events, draftCount)
          }
        >
          <div className="flex flex-col gap-2">
            <Link
              href="/practice?mode=writing"
              className={cn(buttonVariants(), "w-full rounded-full")}
            >
              Open writing mode
            </Link>
          </div>
        </QuickActionCard>

        <QuickActionCard
          icon={Mic}
          title={nextSpeakingPrompt?.title ?? "Next speaking prompt pending"}
          eyebrow="Speaking"
          detail={
            nextSpeakingPrompt?.summary ??
            "A speaking prompt will appear here when the active block links one."
          }
          footer={getSpeakingStatus(events)}
        >
          <Link
            href="/practice?mode=speaking"
            className={cn(buttonVariants(), "w-full rounded-full")}
          >
            Open speaking mode
          </Link>
        </QuickActionCard>
      </div>
    </DashboardCard>
  );
}
