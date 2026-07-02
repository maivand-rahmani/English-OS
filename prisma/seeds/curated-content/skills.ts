import type { SkillSeed } from "./types";

export const skillSeeds: SkillSeed[] = [
  {
    slug: "grammar",
    title: "Grammar",
    description:
      "The sentence patterns that help a learner build correct, understandable English.",
    sortOrder: 1,
    subskills: [
      {
        slug: "simple-sentence-order",
        title: "Simple sentence order",
        description:
          "Using clear subject-verb-object patterns to produce basic statements.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 1,
      },
      {
        slug: "be-and-basic-questions",
        title: "Be verb and basic questions",
        description:
          "Using be, yes-no questions, and short personal questions in early conversation.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 2,
      },
    ],
  },
  {
    slug: "vocabulary",
    title: "Vocabulary",
    description:
      "The everyday words and phrases a learner needs to understand and express routine life.",
    sortOrder: 2,
    subskills: [
      {
        slug: "personal-information-vocabulary",
        title: "Personal information vocabulary",
        description:
          "Words for name, country, job, family, likes, and other basic identity topics.",
        cefrMin: "A1",
        cefrMax: "A1",
        sortOrder: 1,
      },
      {
        slug: "everyday-routines-vocabulary",
        title: "Everyday routines vocabulary",
        description:
          "Common verbs and phrases for time, habits, study, meals, and daily activities.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 2,
      },
    ],
  },
  {
    slug: "reading",
    title: "Reading",
    description:
      "Understanding short written English without turning every sentence into a translation task.",
    sortOrder: 3,
    subskills: [
      {
        slug: "reading-for-key-details",
        title: "Reading for key details",
        description:
          "Finding names, actions, times, and simple meaning in short texts.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 1,
      },
    ],
  },
  {
    slug: "listening",
    title: "Listening",
    description:
      "Understanding slow or clear English well enough to keep momentum and confidence.",
    sortOrder: 4,
    subskills: [
      {
        slug: "listening-for-gist",
        title: "Listening for gist",
        description:
          "Catching the main idea and a few key details without needing full comprehension.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 1,
      },
    ],
  },
  {
    slug: "writing",
    title: "Writing",
    description:
      "Turning passive understanding into short, useful written output with growing accuracy.",
    sortOrder: 5,
    subskills: [
      {
        slug: "short-personal-messages",
        title: "Short personal messages",
        description:
          "Writing short introductions, updates, and routine messages about real life.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 1,
      },
    ],
  },
  {
    slug: "speaking",
    title: "Speaking",
    description:
      "Using simple spoken English regularly enough to reduce fear and build confidence.",
    sortOrder: 6,
    subskills: [
      {
        slug: "self-introduction-and-daily-talk",
        title: "Self-introduction and daily talk",
        description:
          "Sharing who you are, what you do, and how your day looks in simple spoken English.",
        cefrMin: "A1",
        cefrMax: "A2",
        sortOrder: 1,
      },
    ],
  },
];
