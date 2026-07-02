import type { SpeakingPromptSeed, WritingTaskSeed } from "./types";

export const writingTaskSeeds: WritingTaskSeed[] = [
  {
    slug: "introduce-yourself-in-six-sentences",
    roadmapBlockSlug: "express-your-routine-in-short-messages",
    title: "Introduce yourself in six sentences",
    summary:
      "A low-pressure beginner writing task focused on identity, routine, and basic sentence control.",
    instructions:
      "Write 6 short sentences about yourself. Include your name, where you live, what you do most days, one thing you like, and one current English goal. Keep the sentences simple and clear.",
    taskType: "SHORT_GUIDED_RESPONSE",
    cefrStart: "A1",
    cefrEnd: "A1",
    estimatedMinutes: 15,
    wordCountMin: 45,
    wordCountMax: 80,
    successCriteria:
      "The response should stay understandable, personal, and mostly consistent in basic sentence form.",
  },
  {
    slug: "describe-your-typical-day",
    roadmapBlockSlug: "express-your-routine-in-short-messages",
    title: "Describe your typical day",
    summary:
      "A short routine-writing task that turns vocabulary and grammar into connected beginner output.",
    instructions:
      "Write one short paragraph about your normal day. Include morning, afternoon, and evening actions. Use time words like usually, after, before, or at. Do not try to sound advanced. Focus on clarity.",
    taskType: "JOURNAL_REFLECTION",
    cefrStart: "A1",
    cefrEnd: "A2",
    estimatedMinutes: 20,
    wordCountMin: 70,
    wordCountMax: 120,
    successCriteria:
      "The learner should produce a connected paragraph with a visible daily sequence and understandable meaning.",
  },
];

export const speakingPromptSeeds: SpeakingPromptSeed[] = [
  {
    slug: "simple-self-introduction-voice-note",
    roadmapBlockSlug: "simple-sentences-about-you",
    title: "Record a simple self-introduction",
    summary:
      "A confidence-first speaking prompt for saying basic personal information out loud.",
    promptText:
      "Record a short voice note introducing yourself. Say your name, where you are from, what you do, and one thing you enjoy. If you forget a word, keep going with simpler English.",
    promptType: "PERSONAL_RESPONSE",
    cefrStart: "A1",
    cefrEnd: "A1",
    estimatedMinutes: 10,
    targetDurationSeconds: 60,
    prepHint: "Write 4 key words before speaking, but do not script every sentence.",
    followUpQuestion: "Which sentence felt easiest to say, and which one felt uncertain?",
  },
  {
    slug: "talk-about-your-daily-routine",
    roadmapBlockSlug: "express-your-routine-in-short-messages",
    title: "Talk about your daily routine",
    summary:
      "A short personal speaking prompt that reuses routine vocabulary in connected speech.",
    promptText:
      "Speak for one to two minutes about your normal day. Mention when you wake up, what you usually do in the morning, and one study habit you want to keep this week.",
    promptType: "DESCRIPTION",
    cefrStart: "A1",
    cefrEnd: "A2",
    estimatedMinutes: 12,
    targetDurationSeconds: 90,
    prepHint:
      "Think in 3 parts: morning, afternoon, evening. Use that structure while speaking.",
    followUpQuestion: "What part of the routine was hardest to explain clearly?",
  },
];
