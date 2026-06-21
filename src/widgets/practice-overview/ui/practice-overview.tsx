"use client";

import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { Mic, PenSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { DashboardContentState } from "@/entities/dashboard";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { cn } from "@/shared/lib/utils";
import {
  getWorkspaceShellMotion,
  getWorkspaceSwapMotion,
} from "@/shared/lib/workspace-motion";
import { WorkspaceFrame } from "@/shared/ui/surfaces";

import { SpeakingMode } from "./speaking-mode";
import { WritingMode } from "./writing-mode";

type PracticeMode = "writing" | "speaking";

type PracticeOverviewProps = {
  content: DashboardContentState;
  mode: PracticeMode;
};

const practiceModes: Array<{
  icon: typeof PenSquare;
  key: PracticeMode;
  title: string;
}> = [
  {
    key: "writing",
    title: "Writing",
    icon: PenSquare,
  },
  {
    key: "speaking",
    title: "Speaking",
    icon: Mic,
  },
];

export function PracticeOverview({
  content,
  mode: initialMode,
}: PracticeOverviewProps) {
  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;
  const [mode, setMode] = useState<PracticeMode>(() => initialMode);

  useEffect(() => {
    const handlePopState = () => {
      setMode(readModeFromLocation());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleModeChange(nextMode: PracticeMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    window.history.pushState(
      { mode: nextMode },
      "",
      `/practice?mode=${nextMode}`,
    );
  }

  return (
    <Wrapper
      className="mx-auto w-full max-w-full"
      {...getWorkspaceShellMotion(reduced)}
    >
      <WorkspaceFrame className="relative overflow-hidden border-surface-stroke-strong bg-[linear-gradient(180deg,var(--surface-panel-strong),var(--surface-panel))] shadow-float">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--surface-highlight),transparent_42%),radial-gradient(circle_at_14%_18%,var(--surface-module-cream),transparent_26%),radial-gradient(circle_at_86%_16%,var(--surface-module-blue),transparent_24%),radial-gradient(circle_at_50%_100%,var(--surface-module-green),transparent_26%)]"
        />

        <div className="relative">
          <div className="border-b border-surface-stroke px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex justify-center">
              <div
                role="tablist"
                aria-label="Practice mode"
                className="inline-grid grid-cols-2 rounded-full border border-surface-stroke-strong bg-surface-panel p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_36px_rgba(20,20,30,0.08)] backdrop-blur"
              >
                {practiceModes.map((item) => {
                  const isActive = item.key === mode;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-label={`${item.title} mode`}
                      aria-selected={isActive}
                      aria-controls={`${item.key}-workspace`}
                      onClick={() => handleModeChange(item.key)}
                      className={cn(
                        "relative min-w-[9.75rem] rounded-full px-5 py-3 text-sm font-semibold tracking-tight transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] sm:min-w-[11rem]",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isActive ? (
                        reduced ? (
                          <span className="absolute inset-0 rounded-full bg-primary shadow-control" />
                        ) : (
                          <motion.span
                            layoutId="practice-mode-pill"
                            className="absolute inset-0 rounded-full bg-primary shadow-control"
                          />
                        )
                      ) : null}

                      <span className="relative flex items-center justify-center gap-2">
                        <Icon className="size-4" />
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={mode}
              className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
              id={`${mode}-workspace`}
              role="tabpanel"
              aria-label={`${mode} workspace`}
              {...getWorkspaceSwapMotion(reduced, 14)}
            >
              {mode === "writing" ? (
                <WritingMode content={content} />
              ) : (
                <SpeakingMode content={content} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </WorkspaceFrame>
    </Wrapper>
  );
}

function readModeFromLocation(): PracticeMode {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get("mode") === "speaking" ? "speaking" : "writing";
}
