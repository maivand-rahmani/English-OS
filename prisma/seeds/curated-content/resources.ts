import type { BlockResourceLinkSeed, ResourceSeed } from "./types";

export const resourceSeeds: ResourceSeed[] = [
  {
    slug: "british-council-learnenglish",
    title: "British Council LearnEnglish",
    sourceName: "British Council",
    url: "https://learnenglish.britishcouncil.org/",
    description:
      "A broad self-study library with beginner-friendly lessons, exercises, and skill pages.",
    resourceType: "COURSE",
    resourceFormat: "INTERACTIVE",
    primaryUseCase: "FOUNDATION",
    accessType: "FREE",
    difficulty: "GENTLE",
    cefrStart: "A1",
    cefrEnd: "B1",
    estimatedMinutes: 20,
    whyRecommended:
      "It gives beginners one trusted place to practice without getting lost in random links.",
    bestUseCase:
      "Open one short lesson when a roadmap block needs structure, then repeat one related exercise the next day.",
    followUpHint:
      "After a lesson, create three personal sentences that reuse the same grammar or vocabulary.",
    targetAudience: "BEGINNER_SELF_LEARNER",
    isFeatured: true,
    skillMaps: [
      {
        skillSlug: "grammar",
        subskillSlug: "simple-sentence-order",
        emphasis: "PRIMARY",
      },
      {
        skillSlug: "vocabulary",
        subskillSlug: "everyday-routines-vocabulary",
        emphasis: "SUPPORTING",
      },
    ],
  },
  {
    slug: "bbc-learning-english",
    title: "BBC Learning English",
    sourceName: "BBC",
    url: "https://www.bbc.co.uk/learningenglish/",
    description:
      "Short explanations and video-based English practice with a strong editorial voice.",
    resourceType: "VIDEO_SERIES",
    resourceFormat: "VIDEO",
    primaryUseCase: "PRACTICE",
    accessType: "FREE",
    difficulty: "STANDARD",
    cefrStart: "A1",
    cefrEnd: "B1",
    estimatedMinutes: 10,
    whyRecommended:
      "It works well when the learner needs a compact, low-friction explanation plus a little listening exposure.",
    bestUseCase:
      "Use a short episode as a second-touch resource after the main block lesson to keep momentum high.",
    followUpHint: "Pause after one example and say your own similar sentence out loud.",
    targetAudience: "BEGINNER_SELF_LEARNER",
    skillMaps: [
      {
        skillSlug: "grammar",
        subskillSlug: "be-and-basic-questions",
        emphasis: "PRIMARY",
      },
      {
        skillSlug: "listening",
        subskillSlug: "listening-for-gist",
        emphasis: "SUPPORTING",
      },
    ],
  },
  {
    slug: "voa-learning-english",
    title: "VOA Learning English",
    sourceName: "Voice of America",
    url: "https://learningenglish.voanews.com/",
    description:
      "Slow, clear audio and news-style English designed to be more approachable for learners.",
    resourceType: "PODCAST",
    resourceFormat: "AUDIO",
    primaryUseCase: "IMMERSION",
    accessType: "FREE",
    difficulty: "GENTLE",
    cefrStart: "A1",
    cefrEnd: "B1",
    estimatedMinutes: 15,
    whyRecommended:
      "It helps beginners experience real-ish English input without the speed shock of native content.",
    bestUseCase:
      "Use it for focused listening when the active roadmap block is about gist, routine topics, or confidence with input.",
    followUpHint:
      "After listening, write down or say two things you understood before checking details.",
    targetAudience: "BEGINNER_SELF_LEARNER",
    skillMaps: [
      {
        skillSlug: "listening",
        subskillSlug: "listening-for-gist",
        emphasis: "PRIMARY",
      },
      {
        skillSlug: "vocabulary",
        subskillSlug: "everyday-routines-vocabulary",
        emphasis: "SUPPORTING",
      },
    ],
  },
  {
    slug: "cambridge-dictionary",
    title: "Cambridge Dictionary",
    sourceName: "Cambridge",
    url: "https://dictionary.cambridge.org/",
    description:
      "A clean dictionary and pronunciation reference for checking meaning, usage, and examples quickly.",
    resourceType: "REFERENCE",
    resourceFormat: "TEXT",
    primaryUseCase: "REFERENCE",
    accessType: "FREE",
    difficulty: "GENTLE",
    cefrStart: "PRE_A1",
    cefrEnd: "C2",
    estimatedMinutes: 5,
    whyRecommended:
      "It supports self-learners who need a reliable place to confirm meaning without falling into a long search spiral.",
    bestUseCase:
      "Use it as a support tool during a block, not as the block itself.",
    followUpHint: "After checking a word, save one example sentence you can reuse later.",
    isFeatured: true,
    skillMaps: [
      {
        skillSlug: "vocabulary",
        subskillSlug: "personal-information-vocabulary",
        emphasis: "PRIMARY",
      },
      {
        skillSlug: "reading",
        subskillSlug: "reading-for-key-details",
        emphasis: "SUPPORTING",
      },
    ],
  },
  {
    slug: "perfect-english-grammar",
    title: "Perfect English Grammar",
    sourceName: "Perfect English Grammar",
    url: "https://www.perfect-english-grammar.com/",
    description:
      "A grammar reference site that is especially useful for quick review and extra examples.",
    resourceType: "REFERENCE",
    resourceFormat: "TEXT",
    primaryUseCase: "REVIEW",
    accessType: "FREE",
    difficulty: "STANDARD",
    cefrStart: "A1",
    cefrEnd: "B1",
    estimatedMinutes: 10,
    whyRecommended:
      "It gives stuck learners a simple way to re-check a pattern when a roadmap block feels shaky.",
    bestUseCase:
      "Use it after the main lesson when you want one more explanation or a clearer example set.",
    followUpHint:
      "Write two personal examples immediately after reviewing the pattern so it does not stay passive.",
    skillMaps: [
      {
        skillSlug: "grammar",
        subskillSlug: "be-and-basic-questions",
        emphasis: "PRIMARY",
      },
      {
        skillSlug: "grammar",
        subskillSlug: "simple-sentence-order",
        emphasis: "SUPPORTING",
      },
    ],
  },
];

export const blockResourceLinkSeeds: BlockResourceLinkSeed[] = [
  {
    blockSlug: "simple-sentences-about-you",
    resourceSlug: "british-council-learnenglish",
    role: "CORE",
    sortOrder: 1,
    note: "Use a structured lesson first so the learner sees a clear sentence pattern.",
  },
  {
    blockSlug: "simple-sentences-about-you",
    resourceSlug: "perfect-english-grammar",
    role: "SUPPORTING",
    sortOrder: 2,
    note: "Use for a quick grammar check if sentence formation still feels shaky.",
  },
  {
    blockSlug: "starter-vocabulary-for-daily-life",
    resourceSlug: "cambridge-dictionary",
    role: "CORE",
    sortOrder: 1,
    note: "Use it as the safe lookup layer while building a personal word bank.",
  },
  {
    blockSlug: "starter-vocabulary-for-daily-life",
    resourceSlug: "british-council-learnenglish",
    role: "SUPPORTING",
    sortOrder: 2,
    note: "Pair one guided exercise with the vocabulary list so words stay active.",
  },
  {
    blockSlug: "understand-slow-everyday-english",
    resourceSlug: "voa-learning-english",
    role: "CORE",
    sortOrder: 1,
    note: "Use slow audio first to train gist before jumping to denser content.",
  },
  {
    blockSlug: "understand-slow-everyday-english",
    resourceSlug: "bbc-learning-english",
    role: "SUPPORTING",
    sortOrder: 2,
    note: "Use short videos for a lighter second exposure after one focused listening session.",
  },
  {
    blockSlug: "express-your-routine-in-short-messages",
    resourceSlug: "british-council-learnenglish",
    role: "CORE",
    sortOrder: 1,
    note: "Use one beginner writing-friendly lesson as a model before producing your own message.",
  },
  {
    blockSlug: "express-your-routine-in-short-messages",
    resourceSlug: "cambridge-dictionary",
    role: "SUPPORTING",
    sortOrder: 2,
    note: "Use it to confirm a verb or phrase while drafting without leaving the block context.",
  },
];
