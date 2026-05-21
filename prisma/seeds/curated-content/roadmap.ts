import type { BlockSkillMapSeed, RoadmapTemplateSeed } from "./types";

export const roadmapTemplateSeed: RoadmapTemplateSeed = {
  slug: "beginner-self-learner-reset",
  title: "Beginner Self-Learner Reset",
  description:
    "A guided first roadmap for self-learners who need a safe, explainable path instead of random English study.",
  audience: "BEGINNER_SELF_LEARNER",
  cefrStart: "PRE_A1",
  cefrEnd: "A2",
  estimatedWeeks: 8,
  isDefault: true,
  stages: [
    {
      slug: "build-a-safe-base",
      title: "Build a Safe Base",
      summary:
        "Create the first stable layer of sentence patterns and everyday language.",
      purpose:
        "Reduce overwhelm by focusing on the smallest set of patterns that unlock useful beginner English.",
      stageType: "FOUNDATION",
      sortOrder: 1,
      cefrStart: "PRE_A1",
      cefrEnd: "A1",
      estimatedWeeks: 4,
      blocks: [
        {
          slug: "simple-sentences-about-you",
          title: "Build simple sentences about yourself",
          summary:
            "Learn to say who you are, where you are from, and what your life looks like in very simple English.",
          purpose:
            "This block turns basic grammar into usable identity language instead of isolated rules.",
          whyNow:
            "A beginner needs early wins that sound personal and real, not textbook-only output.",
          blockType: "LEARN",
          sortOrder: 1,
          cefrStart: "A1",
          cefrEnd: "A1",
          estimatedMinutes: 45,
          recommendedSessionCount: 3,
        },
        {
          slug: "starter-vocabulary-for-daily-life",
          title: "Build starter vocabulary for daily life",
          summary:
            "Collect and reuse words for family, time, routines, study, and everyday activities.",
          purpose:
            "This block gives the learner enough vocabulary to understand and produce short useful content.",
          whyNow:
            "Vocabulary needs to grow immediately after sentence basics so the learner can say more than fixed phrases.",
          blockType: "PRACTICE",
          sortOrder: 2,
          cefrStart: "A1",
          cefrEnd: "A1",
          estimatedMinutes: 35,
          recommendedSessionCount: 4,
        },
      ],
    },
    {
      slug: "start-understanding-and-responding",
      title: "Start Understanding and Responding",
      summary:
        "Move from isolated study into slow real input and short active output.",
      purpose:
        "Build enough confidence to understand simple English and answer with short personal language.",
      stageType: "ACTIVE_USE",
      sortOrder: 2,
      cefrStart: "A1",
      cefrEnd: "A2",
      estimatedWeeks: 4,
      blocks: [
        {
          slug: "understand-slow-everyday-english",
          title: "Understand slow everyday English",
          summary:
            "Practice listening and reading for the main idea instead of translating every word.",
          purpose:
            "This block makes beginner input feel manageable and trains the learner to keep moving through meaning.",
          whyNow:
            "Once the learner has a small language base, simple input becomes the fastest way to reinforce it.",
          blockType: "PRACTICE",
          sortOrder: 1,
          cefrStart: "A1",
          cefrEnd: "A2",
          estimatedMinutes: 30,
          recommendedSessionCount: 4,
        },
        {
          slug: "express-your-routine-in-short-messages",
          title: "Express your routine in short messages",
          summary:
            "Write and say short updates about your day, habits, and current goals.",
          purpose:
            "This block connects grammar, vocabulary, writing, and speaking into one meaningful beginner output loop.",
          whyNow:
            "Beginners stay motivated when they can turn study into personal expression quickly.",
          blockType: "APPLY",
          sortOrder: 2,
          cefrStart: "A1",
          cefrEnd: "A2",
          estimatedMinutes: 40,
          recommendedSessionCount: 4,
        },
      ],
    },
  ],
};

export const blockSkillMapSeeds: BlockSkillMapSeed[] = [
  {
    blockSlug: "simple-sentences-about-you",
    skillSlug: "grammar",
    subskillSlug: "simple-sentence-order",
    emphasis: "PRIMARY",
  },
  {
    blockSlug: "simple-sentences-about-you",
    skillSlug: "speaking",
    subskillSlug: "self-introduction-and-daily-talk",
    emphasis: "SUPPORTING",
  },
  {
    blockSlug: "starter-vocabulary-for-daily-life",
    skillSlug: "vocabulary",
    subskillSlug: "everyday-routines-vocabulary",
    emphasis: "PRIMARY",
  },
  {
    blockSlug: "starter-vocabulary-for-daily-life",
    skillSlug: "reading",
    subskillSlug: "reading-for-key-details",
    emphasis: "SUPPORTING",
  },
  {
    blockSlug: "understand-slow-everyday-english",
    skillSlug: "listening",
    subskillSlug: "listening-for-gist",
    emphasis: "PRIMARY",
  },
  {
    blockSlug: "understand-slow-everyday-english",
    skillSlug: "vocabulary",
    subskillSlug: "everyday-routines-vocabulary",
    emphasis: "SUPPORTING",
  },
  {
    blockSlug: "express-your-routine-in-short-messages",
    skillSlug: "writing",
    subskillSlug: "short-personal-messages",
    emphasis: "PRIMARY",
  },
  {
    blockSlug: "express-your-routine-in-short-messages",
    skillSlug: "speaking",
    subskillSlug: "self-introduction-and-daily-talk",
    emphasis: "SUPPORTING",
  },
];
