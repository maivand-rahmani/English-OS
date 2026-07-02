"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Drawer } from "@base-ui/react/drawer";
import { Popover } from "@base-ui/react/popover";
import { AlertTriangle, Bell, BookOpen, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";

import {
  LEVEL_OPTIONS,
  MAIN_GOAL_OPTIONS,
  PAIN_POINT_OPTIONS,
  PREFERRED_FORMAT_OPTIONS,
  SKILL_OPTIONS,
} from "@/shared/constants/onboarding";
import { useAppearancePreferences, useLearningProfile, useMediaQuery } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import type {
  InterfaceDensity,
  MotionIntensity,
  TextSize,
  ThemeMode,
} from "@/shared/types";
import { buttonVariants } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Spinner } from "@/shared/ui/spinner";

export type SettingsSectionId =
  | "account"
  | "appearance"
  | "learning-profile"
  | "notifications"
  | "privacy-data";

export type SettingsAccount = {
  displayName: string;
  email: string | null;
  isAuthenticated: boolean;
};

type SettingsCenterProps = {
  account: SettingsAccount;
  activeSection: SettingsSectionId;
  onActiveSectionChange: (section: SettingsSectionId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  routeFallback?: boolean;
};

const sections: ReadonlyArray<{
  id: SettingsSectionId;
  label: string;
}> = [
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "learning-profile", label: "Learning Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy-data", label: "Privacy & Data" },
];

const themeOptions: ReadonlyArray<Option<ThemeMode>> = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const textSizeOptions: ReadonlyArray<Option<TextSize>> = [
  { label: "Small", value: "small" },
  { label: "Default", value: "default" },
  { label: "Large", value: "large" },
];

const densityOptions: ReadonlyArray<Option<InterfaceDensity>> = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

const motionOptions: ReadonlyArray<Option<MotionIntensity>> = [
  { label: "Full", value: "full" },
  { label: "Reduced", value: "reduced" },
];

export function SettingsCenter({
  account,
  activeSection,
  onActiveSectionChange,
  onOpenChange,
  open,
  routeFallback = false,
}: SettingsCenterProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
          <Dialog.Viewport className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <Dialog.Popup className="flex max-h-[min(82vh,46rem)] w-full max-w-[52rem] flex-col overflow-hidden rounded-[1.5rem] border border-surface-stroke bg-surface-panel-strong text-foreground shadow-float outline-none">
              <SettingsHeader
                close={
                  routeFallback ? (
                    <Dialog.Close
                      render={<Link href="/dashboard" role="button" />}
                      aria-label="Close settings"
                      className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                    >
                      <X className="size-4 text-foreground hover:text-primary" />
                    </Dialog.Close>
                  ) : (
                    <Dialog.Close
                      aria-label="Close settings"
                      onClick={() => onOpenChange(false)}
                      className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                    >
                      <X className="size-4 text-foreground hover:text-primary" />
                    </Dialog.Close>
                  )
                }
                title={<Dialog.Title>Settings</Dialog.Title>}
              />

              <div className="grid min-h-0 flex-1 grid-cols-[11.5rem_minmax(0,1fr)]">
                <SettingsSectionNavigation
                  activeSection={activeSection}
                  onChange={onActiveSectionChange}
                />
                <SettingsPanel
                  account={account}
                  activeSection={activeSection}
                />
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="down">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Popup className="fixed inset-x-0 bottom-0 z-[60] flex justify-center outline-none">
          <Drawer.Content className="flex h-[calc(100dvh-0.75rem)] w-full flex-col overflow-hidden rounded-t-[1.5rem] border border-surface-stroke bg-surface-panel-strong text-foreground shadow-float outline-none">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-foreground/15" />
            <SettingsHeader
              close={
                routeFallback ? (
                  <Drawer.Close
                    render={<Link href="/dashboard" role="button" />}
                    aria-label="Close settings"
                    className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                  >
                    <X className="size-4" />
                  </Drawer.Close>
                ) : (
                  <Drawer.Close
                    aria-label="Close settings"
                    onClick={() => onOpenChange(false)}
                    className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                  >
                    <X className="size-4" />
                  </Drawer.Close>
                )
              }
              title={<Drawer.Title>Settings</Drawer.Title>}
            />
            <SettingsMobileNavigation
              activeSection={activeSection}
              onChange={onActiveSectionChange}
            />
            <SettingsPanel
              account={account}
              activeSection={activeSection}
            />
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SettingsHeader({
  close,
  title,
}: {
  close: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      {close}
    </div>
  );
}

function SettingsSectionNavigation({
  activeSection,
  onChange,
}: {
  activeSection: SettingsSectionId;
  onChange: (section: SettingsSectionId) => void;
}) {
  return (
    <nav
      aria-label="Settings sections"
      className="border-r border-border px-3 py-4"
    >
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            aria-current={activeSection === section.id ? "page" : undefined}
            onClick={() => onChange(section.id)}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              activeSection === section.id && "bg-muted text-foreground",
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function SettingsMobileNavigation({
  activeSection,
  onChange,
}: {
  activeSection: SettingsSectionId;
  onChange: (section: SettingsSectionId) => void;
}) {
  return (
    <nav
      aria-label="Settings sections"
      className="mobile-chip-row border-b border-border px-3 py-2"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          aria-current={activeSection === section.id ? "page" : undefined}
          onClick={() => onChange(section.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground",
            activeSection === section.id && "bg-muted text-foreground",
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

function SettingsPanel({
  account,
  activeSection,
}: {
  account: SettingsAccount;
  activeSection: SettingsSectionId;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
      {activeSection === "account" ? <AccountSection account={account} /> : null}
      {activeSection === "appearance" ? <AppearanceSection /> : null}
      {activeSection === "learning-profile" ? <LearningProfileSection /> : null}
      {activeSection === "notifications" ? <NotificationsSection /> : null}
      {activeSection === "privacy-data" ? <PrivacyDataSection /> : null}
    </div>
  );
}

function SectionHeading({
  description,
  title,
}: {
  description?: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function SettingsRows({ children }: { children: React.ReactNode }) {
  return <div className="border-y border-border">{children}</div>;
}

function SettingsRow({
  action,
  description,
  label,
  value,
}: {
  action?: React.ReactNode;
  description?: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 text-right">
        {action ?? (
          <span className="text-sm text-muted-foreground">{value}</span>
        )}
      </div>
    </div>
  );
}

function AccountSection({ account }: { account: SettingsAccount }) {
  return (
    <section aria-labelledby="settings-account-heading">
      <SectionHeading title="Account" />
      <div id="settings-account-heading" className="sr-only">
        Account settings
      </div>
      <SettingsRows>
        <SettingsRow label="Profile" value={account.displayName} />
        <SettingsRow
          label="Email"
          value={account.email ?? "Not available in guest mode"}
        />
        <SettingsRow
          label="Status"
          value={account.isAuthenticated ? "Signed in" : "Guest mode"}
        />
        <SettingsRow
          label="Plan"
          value={account.isAuthenticated ? "Not available yet" : "Guest"}
        />
        {!account.isAuthenticated ? (
          <SettingsRow
            label="Account access"
            action={
              <a
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href="/sign-in"
              >
                Sign in
              </a>
            }
          />
        ) : null}
      </SettingsRows>
    </section>
  );
}

function AppearanceSection() {
  const { preferences, resetPreferences, updatePreferences, isLoaded, error, clearError } =
    useAppearancePreferences();

  return (
    <section aria-labelledby="settings-appearance-heading">
      <SectionHeading title="Appearance" />
      <div id="settings-appearance-heading" className="sr-only">
        Appearance settings
      </div>

      {error ? (
        <div
          className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
          <p className="flex-1 text-sm text-red-700 dark:text-red-300">
            Failed to save preference. {error}
          </p>
          <button
            type="button"
            onClick={clearError}
            className="shrink-0 text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {!isLoaded ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : (
        <SettingsRows>
        <SettingsRow
          label="Theme"
          action={
            <SettingsOptionPopover
              label="Theme"
              options={themeOptions}
              value={preferences.theme}
              onSelect={(theme) => updatePreferences({ theme })}
            />
          }
        />
        <SettingsRow
          label="Text size"
          action={
            <SettingsOptionPopover
              label="Text size"
              options={textSizeOptions}
              value={preferences.textSize}
              onSelect={(textSize) => updatePreferences({ textSize })}
            />
          }
        />
        <SettingsRow
          label="Interface density"
          action={
            <SettingsOptionPopover
              label="Interface density"
              options={densityOptions}
              value={preferences.density}
              onSelect={(density) => updatePreferences({ density })}
            />
          }
        />
        <SettingsRow
          label="Motion"
          action={
            <SettingsOptionPopover
              label="Motion"
              options={motionOptions}
              value={preferences.motion}
              onSelect={(motion) => updatePreferences({ motion })}
            />
          }
        />
        <SettingsRow
          label="Reset appearance"
          action={
            <button
              type="button"
              onClick={resetPreferences}
              className="text-sm font-medium text-foreground hover:underline"
            >
              Reset
            </button>
          }
        />
      </SettingsRows>
      )}
    </section>
  );
}

function LearningProfileSection() {
  const { profile, isLoading } = useLearningProfile();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const { updateLearningProfile } = await import("@/server/learners/update-learning-profile");
      const result = await updateLearningProfile({
        currentLevel: profile.currentLevel,
        mainGoal: profile.mainGoal,
        studyMinutesPerDay: profile.studyMinutesPerDay,
        strongestSkill: profile.strongestSkill,
        weakestSkill: profile.weakestSkill,
        preferredFormats: profile.preferredFormats,
        mainPainPoint: profile.mainPainPoint,
      });
      if (result.success) {
        setNotice("Profile updated");
        setTimeout(() => setNotice(null), 1800);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section aria-labelledby="settings-learning-heading">
        <SectionHeading title="Learning Profile" />
        <div className="flex items-center justify-center py-12">
          <Spinner size="sm" />
        </div>
      </section>
    );
  }

  if (!profile || !profile.completedOnboardingAt) {
    return (
      <section aria-labelledby="settings-learning-heading">
        <SectionHeading title="Learning Profile" />
        <EmptyState
          icon={BookOpen}
          title="No learning profile yet"
          description="Set up your learning profile to get a personalized roadmap and recommendations."
          actions={[
            { label: "Start onboarding", href: "/onboarding", variant: "default" },
          ]}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="settings-learning-heading">
      <SectionHeading
        title="Learning Profile"
        description="Update your level, goal, and preferences. Changes apply across the app."
      />
      <div id="settings-learning-heading" className="sr-only">
        Learning profile settings
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        >
          {notice}
        </div>
      ) : null}

      <div className="space-y-6">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Re-run full onboarding wizard
        </Link>

        <SettingsRows>
          <SettingsRow
            label="Level"
            value={LEVEL_OPTIONS.find((o) => o.value === profile.currentLevel)?.label ?? "Not set"}
          />
          <SettingsRow
            label="Main goal"
            value={MAIN_GOAL_OPTIONS.find((o) => o.value === profile.mainGoal)?.label ?? "Not set"}
          />
          <SettingsRow
            label="Daily study time"
            value={
              profile.studyMinutesPerDay != null
                ? `${profile.studyMinutesPerDay} min/day`
                : "Not set"
            }
          />
          <SettingsRow
            label="Strongest skill"
            value={SKILL_OPTIONS.find((o) => o.value === profile.strongestSkill)?.label ?? "Not set"}
          />
          <SettingsRow
            label="Skill to grow"
            value={SKILL_OPTIONS.find((o) => o.value === profile.weakestSkill)?.label ?? "Not set"}
          />
          <SettingsRow
            label="Biggest pain point"
            value={PAIN_POINT_OPTIONS.find((o) => o.value === profile.mainPainPoint)?.label ?? "Not set"}
          />
          <SettingsRow
            label="Preferred formats"
            value={
              (profile.preferredFormats ?? [])
                .map((f) => PREFERRED_FORMAT_OPTIONS.find((o) => o.value === f)?.label ?? f)
                .join(", ") || "Not set"
            }
          />
        </SettingsRows>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
          >
            {saving ? "Saving..." : "Mark as saved"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          To change individual fields, re-run the full onboarding wizard.
        </p>
      </div>
    </section>
  );
}

function NotificationsSection() {
  return (
    <section aria-labelledby="settings-notifications-heading">
      <SectionHeading title="Notifications" />
      <div id="settings-notifications-heading" className="sr-only">
        Notification settings
      </div>
      <EmptyState
        icon={Bell}
        title="Notifications coming soon"
        description="Notifications will be available in a future update. You'll be able to manage study reminders, review alerts, and weekly summaries here."
      />
    </section>
  );
}

function PrivacyDataSection() {
  return (
    <section aria-labelledby="settings-privacy-heading">
      <SectionHeading title="Privacy & Data" />
      <div id="settings-privacy-heading" className="sr-only">
        Privacy and data settings
      </div>
      <SettingsRows>
        <SettingsRow label="Preference storage" value="On this device" />
        <SettingsRow label="Account sync" value="Not available yet" />
        <SettingsRow label="Export data" value="Not available yet" />
        <SettingsRow label="Delete account data" value="Not available yet" />
      </SettingsRows>
    </section>
  );
}

type Option<T extends string> = {
  label: string;
  value: T;
};

function SettingsOptionPopover<T extends string>({
  label,
  onSelect,
  options,
  value,
}: {
  label: string;
  onSelect: (value: T) => void;
  options: ReadonlyArray<Option<T>>;
  value: T;
}) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={`${label}: ${selected.label}`}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {selected.label}
        <ChevronDown className="size-3.5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          align="end"
          side="bottom"
          sideOffset={6}
          className="z-[80]"
        >
          <Popover.Popup className="min-w-40 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-float outline-none">
            <Popover.Title className="sr-only">{label}</Popover.Title>
            {options.map((option) => (
              <Popover.Close
                key={option.value}
                onClick={() => onSelect(option.value)}
                className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span>{option.label}</span>
                {option.value === value ? <Check className="size-4" /> : null}
              </Popover.Close>
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
