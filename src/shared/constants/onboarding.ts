import { z } from "zod";

export type Option<V extends string> = {
  value: V;
  label: string;
  helperText?: string;
};

export const LEVEL_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "PRE_A1", label: "Pre-A1 (just starting)" },
  { value: "A1", label: "A1 (beginner)" },
  { value: "A2", label: "A2 (elementary)" },
  { value: "B1", label: "B1 (intermediate)" },
  { value: "B2", label: "B2 (upper intermediate)" },
  { value: "C1", label: "C1 (advanced)" },
  { value: "C2", label: "C2 (mastery)" },
];

export const MAIN_GOAL_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "BUILD_FOUNDATION", label: "Build a strong foundation", helperText: "Start with grammar, vocabulary, and simple input" },
  { value: "SPEAK_MORE_CONFIDENTLY", label: "Speak more confidently", helperText: "Active speaking practice with prompts" },
  { value: "STUDY_MORE_CONSISTENTLY", label: "Study more consistently", helperText: "Build a daily routine that sticks" },
  { value: "IMPROVE_COMPREHENSION", label: "Improve daily comprehension", helperText: "Understand more of what you read and hear" },
  { value: "IMPROVE_WRITING_EXPRESSION", label: "Improve writing and expression", helperText: "Send emails, write essays, express complex ideas" },
];

export const STUDY_TIME_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "10", label: "10 min/day" },
  { value: "20", label: "20 min/day", helperText: "Most popular for steady progress" },
  { value: "30", label: "30 min/day" },
  { value: "45", label: "45 min/day" },
  { value: "60", label: "60+ min/day", helperText: "For serious self-learners" },
];

export const SKILL_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "grammar", label: "Grammar" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "listening", label: "Listening" },
  { value: "reading", label: "Reading" },
  { value: "speaking", label: "Speaking" },
  { value: "writing", label: "Writing" },
];

export const PAIN_POINT_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "TOO_MANY_RESOURCES", label: "Too many resources, no clear path" },
  { value: "NO_STRUCTURE", label: "No structure to my learning" },
  { value: "FORGETS_WHAT_LEARNED", label: "I forget what I learn quickly" },
  { value: "LOW_CONFIDENCE_SPEAKING", label: "Low confidence speaking" },
  { value: "NO_PROGRESS_VISIBILITY", label: "Hard to see my progress" },
  { value: "OTHER", label: "Something else" },
];

export const PREFERRED_FORMAT_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "video", label: "Videos" },
  { value: "audio", label: "Podcasts / audio" },
  { value: "text", label: "Reading" },
  { value: "interactive", label: "Interactive exercises" },
  { value: "mixed", label: "Mix of everything" },
];

export type OnboardingStepKey = "level" | "goal" | "rhythm" | "focus" | "summary";

export type OnboardingStep = {
  key: OnboardingStepKey;
  title: string;
  description?: string;
};

export const ONBOARDING_STEPS: ReadonlyArray<OnboardingStep> = [
  { key: "level", title: "Where are you now?" },
  { key: "goal", title: "What's your main goal?" },
  { key: "rhythm", title: "How much time do you have?" },
  { key: "focus", title: "Where do you want to focus?" },
  { key: "summary", title: "Review and confirm" },
];

// Zod schema — matches the Prisma enums we'll add in T1
export const OnboardingFormSchema = z.object({
  currentLevel: z.enum([
    "PRE_A1",
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
  ]),
  mainGoal: z.enum([
    "BUILD_FOUNDATION",
    "SPEAK_MORE_CONFIDENTLY",
    "STUDY_MORE_CONSISTENTLY",
    "IMPROVE_COMPREHENSION",
    "IMPROVE_WRITING_EXPRESSION",
  ]),
  studyMinutesPerDay: z
    .number({ message: "Pick a study time" })
    .int()
    .min(5, "At least 5 minutes")
    .max(180, "That's a lot — let's keep it sustainable"),
  strongestSkill: z.enum([
    "grammar",
    "vocabulary",
    "listening",
    "reading",
    "speaking",
    "writing",
  ]),
  weakestSkill: z.enum([
    "grammar",
    "vocabulary",
    "listening",
    "reading",
    "speaking",
    "writing",
  ]),
  preferredFormats: z
    .array(
      z.enum(["video", "audio", "text", "interactive", "mixed"]),
    )
    .min(1, "Pick at least one format"),
  mainPainPoint: z.enum([
    "TOO_MANY_RESOURCES",
    "NO_STRUCTURE",
    "FORGETS_WHAT_LEARNED",
    "LOW_CONFIDENCE_SPEAKING",
    "NO_PROGRESS_VISIBILITY",
    "OTHER",
  ]),
  displayName: z.string().trim().min(1).max(60).optional(),
});

export type OnboardingFormData = z.infer<typeof OnboardingFormSchema>;
