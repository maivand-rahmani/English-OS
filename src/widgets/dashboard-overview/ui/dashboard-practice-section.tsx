import Link from "next/link";
import { Mic, PenSquare, Sparkles } from "lucide-react";

import type { LearningEvent } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import type { DraftSummary } from "@/shared/types";

import type {
  SpeakingPromptWithContext,
  WritingTaskWithContext,
} from "../model/dashboard-overview-types";
import {
  formatRelativeTimestamp,
  getSpeakingStatus,
  getWritingStatus,
} from "../model/dashboard-overview-formatters";
import { DashboardCard, QuickActionCard, SectionEyebrow } from "./dashboard-surfaces";

type DashboardPracticeSectionProps = {
  busyAction: string | null;
  draftCount: number;
  draftForWritingTask: DraftSummary | undefined;
  draftNotice: string | null;
  events: LearningEvent[];
  nextSpeakingPrompt: SpeakingPromptWithContext | null;
  nextWritingTask: WritingTaskWithContext | null;
  onCreateDraft: (task: WritingTaskWithContext) => void;
};

export function DashboardPracticeSection({
  busyAction,
  draftCount,
  draftForWritingTask,
  draftNotice,
  events,
  nextSpeakingPrompt,
  nextWritingTask,
  onCreateDraft,
}: DashboardPracticeSectionProps) {
  return (
    <DashboardCard className="p-5">
      <SectionEyebrow icon={Sparkles}>Writing and speaking</SectionEyebrow>
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
            <Link href="/writing" className={cn(buttonVariants(), "w-full rounded-full")}>
              Open writing workspace
            </Link>
            {nextWritingTask && !draftForWritingTask ? (
              <button
                type="button"
                onClick={() => onCreateDraft(nextWritingTask)}
                disabled={busyAction === `draft:${nextWritingTask.id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full border-white/70 bg-white/80",
                )}
              >
                Create local draft stub
              </button>
            ) : null}
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
          <Link href="/speaking" className={cn(buttonVariants(), "w-full rounded-full")}>
            Open speaking workspace
          </Link>
        </QuickActionCard>
      </div>

      {draftNotice ? (
        <div className="mt-4 rounded-[1.1rem] border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          {draftNotice}
        </div>
      ) : null}
    </DashboardCard>
  );
}
