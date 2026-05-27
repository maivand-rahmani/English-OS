"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { Bell, Shield, SlidersHorizontal, Target, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import { useAppearancePreferences } from "@/shared/hooks";
import type {
  InterfaceDensity,
  MotionIntensity,
  TextSize,
  ThemeMode,
} from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  InsetPanel,
  QuickActionCard,
  SectionEyebrow,
  SmallTag,
} from "@/shared/ui/surfaces";
import { cn } from "@/shared/lib/utils";

const themeOptions: ThemeMode[] = ["system", "light", "dark"];
const textSizeOptions: TextSize[] = ["small", "default", "large"];
const densityOptions: InterfaceDensity[] = ["comfortable", "compact"];
const motionOptions: MotionIntensity[] = ["full", "reduced"];

export function SettingsOverview() {
  const { preferences, resetPreferences, updatePreferences } =
    useAppearancePreferences();

  const reduced = useReducedMotion();
  const Wrapper: ElementType = reduced ? "section" : motion.section;

  return (
    <Wrapper
      className="space-y-[var(--layout-gap)]"
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <DashboardCard tone="cream" className="p-6 sm:p-7">
        <SectionEyebrow icon={SlidersHorizontal}>Settings studio</SectionEyebrow>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.6rem]">
          Shape the product around your study rhythm.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Keep appearance, profile, goals, and account controls in one calm
          settings workspace so the product stays personal and easy to return to.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SmallTag>{capitalize(preferences.theme)} theme</SmallTag>
          <SmallTag>{capitalize(preferences.textSize)} text</SmallTag>
          <SmallTag>{capitalize(preferences.density)} density</SmallTag>
          <SmallTag>{capitalize(preferences.motion)} motion</SmallTag>
        </div>

        <div className="mobile-stacked-actions mt-8">
          <button
            type="button"
            onClick={() => resetPreferences()}
            className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
          >
            Reset appearance
          </button>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "sm:w-auto",
            )}
          >
            Preview dashboard
          </Link>
        </div>
      </DashboardCard>

      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <DashboardCard tone="default" className="p-5 sm:p-6">
          <SectionEyebrow icon={SlidersHorizontal}>Appearance controls</SectionEyebrow>
          <div className="mt-5 space-y-5">
            <PreferenceGroup
              label="Theme"
              options={themeOptions}
              value={preferences.theme}
              onSelect={(theme) => updatePreferences({ theme })}
            />
            <PreferenceGroup
              label="Text size"
              options={textSizeOptions}
              value={preferences.textSize}
              onSelect={(textSize) => updatePreferences({ textSize })}
            />
            <PreferenceGroup
              label="Density"
              options={densityOptions}
              value={preferences.density}
              onSelect={(density) => updatePreferences({ density })}
            />
            <PreferenceGroup
              label="Motion"
              options={motionOptions}
              value={preferences.motion}
              onSelect={(motion) => updatePreferences({ motion })}
            />
          </div>
        </DashboardCard>

        <div className="space-y-[var(--layout-gap)]">
          <DashboardCard tone="green" className="p-5">
            <SectionEyebrow icon={UserRound}>Applied now</SectionEyebrow>
            <div className="mt-5 grid gap-3">
              <InsetPanel className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Theme
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {capitalize(preferences.theme)}
                </p>
              </InsetPanel>
              <InsetPanel tone="cream" className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Text size
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {capitalize(preferences.textSize)}
                </p>
              </InsetPanel>
              <InsetPanel tone="green" className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Density and motion
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {capitalize(preferences.density)} / {capitalize(preferences.motion)}
                </p>
              </InsetPanel>
            </div>
          </DashboardCard>

          <DashboardCard tone="lavender" className="p-5">
            <SectionEyebrow icon={Target}>Learner setup</SectionEyebrow>
            <div className="mt-5 grid gap-4">
              <QuickActionCard
                icon={UserRound}
                eyebrow="Profile"
                title="Personal profile and study direction"
                detail="Keep your current level, goals, and preferred study rhythm aligned with the learning system."
                footer="Profile and goals guide roadmap and recommendations"
                tone="lavender"
              >
                <Link
                  href="/onboarding"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Review onboarding choices
                </Link>
              </QuickActionCard>
            </div>
          </DashboardCard>

          <DashboardCard tone="blue" className="p-5">
            <SectionEyebrow icon={Shield}>Notifications and account</SectionEyebrow>
            <div className="mt-5 grid gap-3">
              <InsetPanel tone="blue" className="p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Bell className="size-4" />
                  Notification calmness
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Keep notifications lightweight so reminders help without making the
                  product feel noisy.
                </p>
              </InsetPanel>
              <InsetPanel className="p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Shield className="size-4" />
                  Account access
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use sign-in and account settings to keep the workspace personal
                  while preserving a calm product feel.
                </p>
              </InsetPanel>
            </div>
          </DashboardCard>
        </div>
      </div>
    </Wrapper>
  );
}

type PreferenceGroupProps<T extends string> = {
  label: string;
  onSelect: (value: T) => void;
  options: readonly T[];
  value: T;
};

function PreferenceGroup<T extends string>({
  label,
  onSelect,
  options,
  value,
}: PreferenceGroupProps<T>) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={`${label}:${option}`}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
              value === option
                ? "border-transparent bg-surface-dark-control text-primary-foreground shadow-control"
                : "border-surface-stroke-strong bg-surface-panel-muted text-muted-foreground hover:bg-surface-panel-strong hover:text-foreground",
            )}
          >
            {capitalize(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function capitalize(value: string) {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}
