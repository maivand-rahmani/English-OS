"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Edit3, Sparkles } from "lucide-react";

import {
  LEVEL_OPTIONS,
  MAIN_GOAL_OPTIONS,
  PAIN_POINT_OPTIONS,
  PREFERRED_FORMAT_OPTIONS,
  SKILL_OPTIONS,
  STUDY_TIME_OPTIONS,
  type OnboardingFormData,
} from "@/shared/constants/onboarding";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useOnboardingState } from "@/widgets/onboarding-wizard/model/use-onboarding-state";
import { CheckboxGroup } from "@/shared/ui/checkbox-group";
import { ProgressDots } from "@/shared/ui/progress-dots";
import { RadioGroup } from "@/shared/ui/radio-group";
import { buttonVariants } from "@/shared/ui/button";
import {
  DashboardCard,
  InsetPanel,
  SectionEyebrow,
} from "@/shared/ui/surfaces";
import { cn } from "@/shared/lib/utils";

type OnboardingWizardProps = {
  initialData?: {
    currentLevel?: string | null;
    mainGoal?: string | null;
    studyMinutesPerDay?: number | null;
    strongestSkill?: string | null;
    weakestSkill?: string | null;
    preferredFormats?: string[];
    mainPainPoint?: string | null;
  };
  isReRun?: boolean;
};

const STUDIO_RHYTHM_LABELS: Record<number, string> = {
  10: "10 min/day",
  20: "20 min/day",
  30: "30 min/day",
  45: "45 min/day",
  60: "60+ min/day",
};

export function OnboardingWizard({
  initialData,
  isReRun = false,
}: OnboardingWizardProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const {
    state,
    canGoBack,
    canGoNext,
    canSubmit,
    isLastStep,
    progress,
    currentStep,
    setLevel,
    setGoal,
    setRhythm,
    setStrongestSkill,
    setWeakestSkill,
    setPreferredFormats,
    setPainPoint,
    goNext,
    goBack,
    goToStep,
    submit,
    isSubmitting,
    completeMutation,
    hydrate,
  } = useOnboardingState(initialData as never);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      hydrate(initialData as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (completeMutation.isSuccess) {
      router.push("/dashboard");
    }
  }, [completeMutation.isSuccess, router]);

  function handleSubmit() {
    submit();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <SectionEyebrow icon={Sparkles}>English OS</SectionEyebrow>
        <ProgressDots current={progress.current} total={progress.total} />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {currentStep.title}
        </h1>
        {isReRun ? (
          <p className="text-sm text-muted-foreground">Updating your profile</p>
        ) : null}
      </div>

      <DashboardCard className="p-5 sm:p-7">
        {state.error ? (
          <div
            role="alert"
            className="mb-5 rounded-[1.2rem] border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {state.error}
          </div>
        ) : null}

        <div
          className={cn(
            "min-h-[20rem]",
            !reduced && "transition-opacity duration-200",
          )}
        >
          {currentStep.key === "level" ? (
            <RadioGroup
              ariaLabel="Current level"
              options={LEVEL_OPTIONS as never}
              value={state.data.currentLevel ?? null}
              onChange={(value) => setLevel(value as never)}
            />
          ) : null}

          {currentStep.key === "goal" ? (
            <RadioGroup
              ariaLabel="Main goal"
              options={MAIN_GOAL_OPTIONS as never}
              value={state.data.mainGoal ?? null}
              onChange={(value) => setGoal(value as never)}
            />
          ) : null}

          {currentStep.key === "rhythm" ? (
            <RadioGroup
              ariaLabel="Study rhythm"
              options={STUDY_TIME_OPTIONS as never}
              value={
                state.data.studyMinutesPerDay != null
                  ? String(state.data.studyMinutesPerDay)
                  : null
              }
              onChange={(value) => setRhythm(Number(value))}
            />
          ) : null}

          {currentStep.key === "focus" ? (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Strongest skill
                </p>
                <RadioGroup
                  ariaLabel="Strongest skill"
                  options={SKILL_OPTIONS as never}
                  value={state.data.strongestSkill ?? null}
                  onChange={(value) => setStrongestSkill(value as never)}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Skill you want to grow
                </p>
                <RadioGroup
                  ariaLabel="Weakest skill"
                  options={SKILL_OPTIONS as never}
                  value={state.data.weakestSkill ?? null}
                  onChange={(value) => setWeakestSkill(value as never)}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Biggest pain point
                </p>
                <RadioGroup
                  ariaLabel="Main pain point"
                  options={PAIN_POINT_OPTIONS as never}
                  value={state.data.mainPainPoint ?? null}
                  onChange={(value) => setPainPoint(value as never)}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Preferred formats (pick at least one)
                </p>
                <CheckboxGroup
                  ariaLabel="Preferred formats"
                  options={PREFERRED_FORMAT_OPTIONS as never}
                  value={state.data.preferredFormats ?? []}
                  onChange={(value) => setPreferredFormats(value as never)}
                />
              </div>
            </div>
          ) : null}

          {currentStep.key === "summary" ? (
            <SummaryStep
              data={state.data}
              onEditStep={(step) => goToStep(step)}
            />
          ) : null}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack || isSubmitting}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-full",
              (!canGoBack || isSubmitting) && "invisible",
            )}
          >
            <ArrowLeft className="mr-1.5 size-4" />
            Back
          </button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {!isReRun ? (
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Link>
            ) : null}
            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
              >
                {isSubmitting ? "Saving..." : "Start my roadmap"}
                <Check className="ml-1.5 size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
              >
                Next
                <ArrowRight className="ml-1.5 size-4" />
              </button>
            )}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}

function SummaryStep({
  data,
  onEditStep,
}: {
  data: Partial<OnboardingFormData>;
  onEditStep: (step: number) => void;
}) {
  const levelLabel =
    LEVEL_OPTIONS.find((o) => o.value === data.currentLevel)?.label ??
    "Not set";
  const goalLabel =
    MAIN_GOAL_OPTIONS.find((o) => o.value === data.mainGoal)?.label ??
    "Not set";
  const rhythmLabel =
    data.studyMinutesPerDay != null
      ? (STUDIO_RHYTHM_LABELS[data.studyMinutesPerDay] ??
        `${data.studyMinutesPerDay} min/day`)
      : "Not set";
  const strongestLabel =
    SKILL_OPTIONS.find((o) => o.value === data.strongestSkill)?.label ??
    "Not set";
  const weakestLabel =
    SKILL_OPTIONS.find((o) => o.value === data.weakestSkill)?.label ??
    "Not set";
  const painLabel =
    PAIN_POINT_OPTIONS.find((o) => o.value === data.mainPainPoint)?.label ??
    "Not set";
  const formatLabels = (data.preferredFormats ?? []).map(
    (f) =>
      PREFERRED_FORMAT_OPTIONS.find((o) => o.value === f)?.label ?? f,
  );

  const rows: Array<{ step: number; label: string; value: string }> = [
    { step: 0, label: "Level", value: levelLabel },
    { step: 1, label: "Goal", value: goalLabel },
    { step: 2, label: "Daily rhythm", value: rhythmLabel },
    { step: 3, label: "Strongest", value: strongestLabel },
    { step: 3, label: "Want to grow", value: weakestLabel },
    { step: 3, label: "Biggest pain point", value: painLabel },
    { step: 3, label: "Formats", value: formatLabels.join(", ") || "Not set" },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row, idx) => (
        <InsetPanel
          key={`${row.label}-${idx}`}
          className="flex items-center justify-between p-3"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {row.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {row.value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(row.step)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${row.label}`}
          >
            <Edit3 className="size-4" />
          </button>
        </InsetPanel>
      ))}
    </div>
  );
}
