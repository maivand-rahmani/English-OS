"use client";

import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

type RoadmapProgressRingProps = {
  className?: string;
  progress: number;
  tone: "blue" | "green" | "amber" | "rose" | "muted";
};

const toneClasses = {
  blue: "stroke-sky-500",
  green: "stroke-emerald-500",
  amber: "stroke-amber-500",
  rose: "stroke-rose-500",
  muted: "stroke-slate-400",
};

export function RoadmapProgressRing({ className, progress, tone }: RoadmapProgressRingProps) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (Math.max(0, Math.min(progress, 100)) / 100) * circumference;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full -rotate-90", className)}
      viewBox="0 0 72 72"
    >
      <circle
        cx="36"
        cy="36"
        fill="none"
        r="28"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[color:var(--surface-stroke-strong)]"
      />
      <motion.circle
        cx="36"
        cy="36"
        fill="none"
        r="28"
        strokeLinecap="round"
        strokeWidth="4"
        className={toneClasses[tone]}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
}
