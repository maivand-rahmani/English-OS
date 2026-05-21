import type {
  CefrLevel,
  MapStrength,
  PrismaClient,
  ResourceAccessType,
  ResourceDifficulty,
  ResourceFormat,
  ResourceType,
  ResourceUseCase,
  RoadmapBlockResourceRole,
  RoadmapBlockType,
  RoadmapStageType,
  RoadmapTemplateAudience,
  SpeakingPromptType,
  WritingTaskType,
} from "@prisma/client";

type SkillSeed = {
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  subskills: Array<{
    slug: string;
    title: string;
    description: string;
    cefrMin?: CefrLevel;
    cefrMax?: CefrLevel;
    sortOrder: number;
  }>;
};

type RoadmapTemplateSeed = {
  slug: string;
  title: string;
  description: string;
  audience: RoadmapTemplateAudience;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedWeeks: number;
  isDefault: boolean;
  stages: Array<{
    slug: string;
    title: string;
    summary: string;
    purpose: string;
    stageType: RoadmapStageType;
    sortOrder: number;
    cefrStart?: CefrLevel;
    cefrEnd?: CefrLevel;
    estimatedWeeks: number;
    blocks: Array<{
      slug: string;
      title: string;
      summary: string;
      purpose: string;
      whyNow: string;
      blockType: RoadmapBlockType;
      sortOrder: number;
      cefrStart?: CefrLevel;
      cefrEnd?: CefrLevel;
      estimatedMinutes: number;
      recommendedSessionCount: number;
    }>;
  }>;
};

type BlockSkillMapSeed = {
  blockSlug: string;
  skillSlug: string;
  subskillSlug?: string;
  emphasis: MapStrength;
};

type ResourceSeed = {
  slug: string;
  title: string;
  sourceName: string;
  url: string;
  description: string;
  resourceType: ResourceType;
  resourceFormat: ResourceFormat;
  primaryUseCase: ResourceUseCase;
  accessType: ResourceAccessType;
  difficulty: ResourceDifficulty;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  whyRecommended: string;
  bestUseCase: string;
  followUpHint?: string;
  targetAudience?: RoadmapTemplateAudience;
  isFeatured?: boolean;
  skillMaps: Array<{
    skillSlug: string;
    subskillSlug?: string;
    emphasis: MapStrength;
  }>;
};

type BlockResourceLinkSeed = {
  blockSlug: string;
  resourceSlug: string;
  role: RoadmapBlockResourceRole;
  sortOrder: number;
  note?: string;
};

type WritingTaskSeed = {
  slug: string;
  roadmapBlockSlug?: string;
  title: string;
  summary: string;
  instructions: string;
  taskType: WritingTaskType;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  wordCountMin?: number;
  wordCountMax?: number;
  successCriteria?: string;
};

type SpeakingPromptSeed = {
  slug: string;
  roadmapBlockSlug?: string;
  title: string;
  summary: string;
  promptText: string;
  promptType: SpeakingPromptType;
  cefrStart?: CefrLevel;
  cefrEnd?: CefrLevel;
  estimatedMinutes?: number;
  targetDurationSeconds?: number;
  prepHint?: string;
  followUpQuestion?: string;
};

const skillSeeds: SkillSeed[] = [
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

const roadmapTemplateSeed: RoadmapTemplateSeed = {
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

const blockSkillMapSeeds: BlockSkillMapSeed[] = [
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

const resourceSeeds: ResourceSeed[] = [
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
    followUpHint:
      "Pause after one example and say your own similar sentence out loud.",
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
    followUpHint:
      "After checking a word, save one example sentence you can reuse later.",
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

const blockResourceLinkSeeds: BlockResourceLinkSeed[] = [
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

const writingTaskSeeds: WritingTaskSeed[] = [
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

const speakingPromptSeeds: SpeakingPromptSeed[] = [
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
    prepHint:
      "Write 4 key words before speaking, but do not script every sentence.",
    followUpQuestion:
      "Which sentence felt easiest to say, and which one felt uncertain?",
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
    followUpQuestion:
      "What part of the routine was hardest to explain clearly?",
  },
];

function requireId(
  id: string | undefined,
  entityType: string,
  slug: string,
): string {
  if (!id) {
    throw new Error(`Missing ${entityType} seed dependency for slug: ${slug}`);
  }

  return id;
}

export async function seedCuratedContent(prisma: PrismaClient) {
  await prisma.$transaction(
    async (tx) => {
      const skillIdBySlug = new Map<string, string>();
      const subskillIdBySlug = new Map<string, string>();
      const blockIdBySlug = new Map<string, string>();
      const resourceIdBySlug = new Map<string, string>();

      for (const skillSeed of skillSeeds) {
        const skill = await tx.skill.upsert({
          where: { slug: skillSeed.slug },
          create: {
            slug: skillSeed.slug,
            title: skillSeed.title,
            description: skillSeed.description,
            sortOrder: skillSeed.sortOrder,
          },
          update: {
            title: skillSeed.title,
            description: skillSeed.description,
            sortOrder: skillSeed.sortOrder,
            isActive: true,
          },
        });

        skillIdBySlug.set(skillSeed.slug, skill.id);

        for (const subskillSeed of skillSeed.subskills) {
          const subskill = await tx.subskill.upsert({
            where: { slug: subskillSeed.slug },
            create: {
              skillId: skill.id,
              slug: subskillSeed.slug,
              title: subskillSeed.title,
              description: subskillSeed.description,
              cefrMin: subskillSeed.cefrMin,
              cefrMax: subskillSeed.cefrMax,
              sortOrder: subskillSeed.sortOrder,
            },
            update: {
              skillId: skill.id,
              title: subskillSeed.title,
              description: subskillSeed.description,
              cefrMin: subskillSeed.cefrMin,
              cefrMax: subskillSeed.cefrMax,
              sortOrder: subskillSeed.sortOrder,
              isActive: true,
            },
          });

          subskillIdBySlug.set(subskillSeed.slug, subskill.id);
        }
      }

      const template = await tx.roadmapTemplate.upsert({
        where: { slug: roadmapTemplateSeed.slug },
        create: {
          slug: roadmapTemplateSeed.slug,
          title: roadmapTemplateSeed.title,
          description: roadmapTemplateSeed.description,
          audience: roadmapTemplateSeed.audience,
          cefrStart: roadmapTemplateSeed.cefrStart,
          cefrEnd: roadmapTemplateSeed.cefrEnd,
          estimatedWeeks: roadmapTemplateSeed.estimatedWeeks,
          isDefault: roadmapTemplateSeed.isDefault,
        },
        update: {
          title: roadmapTemplateSeed.title,
          description: roadmapTemplateSeed.description,
          audience: roadmapTemplateSeed.audience,
          cefrStart: roadmapTemplateSeed.cefrStart,
          cefrEnd: roadmapTemplateSeed.cefrEnd,
          estimatedWeeks: roadmapTemplateSeed.estimatedWeeks,
          isDefault: roadmapTemplateSeed.isDefault,
          isPublished: true,
        },
      });

      for (const stageSeed of roadmapTemplateSeed.stages) {
        const stage = await tx.roadmapStage.upsert({
          where: {
            roadmapTemplateId_slug: {
              roadmapTemplateId: template.id,
              slug: stageSeed.slug,
            },
          },
          create: {
            roadmapTemplateId: template.id,
            slug: stageSeed.slug,
            title: stageSeed.title,
            summary: stageSeed.summary,
            purpose: stageSeed.purpose,
            stageType: stageSeed.stageType,
            sortOrder: stageSeed.sortOrder,
            cefrStart: stageSeed.cefrStart,
            cefrEnd: stageSeed.cefrEnd,
            estimatedWeeks: stageSeed.estimatedWeeks,
          },
          update: {
            title: stageSeed.title,
            summary: stageSeed.summary,
            purpose: stageSeed.purpose,
            stageType: stageSeed.stageType,
            sortOrder: stageSeed.sortOrder,
            cefrStart: stageSeed.cefrStart,
            cefrEnd: stageSeed.cefrEnd,
            estimatedWeeks: stageSeed.estimatedWeeks,
          },
        });

        for (const blockSeed of stageSeed.blocks) {
          const block = await tx.roadmapBlock.upsert({
            where: {
              roadmapStageId_slug: {
                roadmapStageId: stage.id,
                slug: blockSeed.slug,
              },
            },
            create: {
              roadmapStageId: stage.id,
              slug: blockSeed.slug,
              title: blockSeed.title,
              summary: blockSeed.summary,
              purpose: blockSeed.purpose,
              whyNow: blockSeed.whyNow,
              blockType: blockSeed.blockType,
              sortOrder: blockSeed.sortOrder,
              cefrStart: blockSeed.cefrStart,
              cefrEnd: blockSeed.cefrEnd,
              estimatedMinutes: blockSeed.estimatedMinutes,
              recommendedSessionCount: blockSeed.recommendedSessionCount,
            },
            update: {
              title: blockSeed.title,
              summary: blockSeed.summary,
              purpose: blockSeed.purpose,
              whyNow: blockSeed.whyNow,
              blockType: blockSeed.blockType,
              sortOrder: blockSeed.sortOrder,
              cefrStart: blockSeed.cefrStart,
              cefrEnd: blockSeed.cefrEnd,
              estimatedMinutes: blockSeed.estimatedMinutes,
              recommendedSessionCount: blockSeed.recommendedSessionCount,
            },
          });

          blockIdBySlug.set(blockSeed.slug, block.id);
        }
      }

      for (const resourceSeed of resourceSeeds) {
        const resource = await tx.resource.upsert({
          where: { slug: resourceSeed.slug },
          create: {
            slug: resourceSeed.slug,
            title: resourceSeed.title,
            sourceName: resourceSeed.sourceName,
            url: resourceSeed.url,
            description: resourceSeed.description,
            resourceType: resourceSeed.resourceType,
            resourceFormat: resourceSeed.resourceFormat,
            primaryUseCase: resourceSeed.primaryUseCase,
            accessType: resourceSeed.accessType,
            difficulty: resourceSeed.difficulty,
            cefrStart: resourceSeed.cefrStart,
            cefrEnd: resourceSeed.cefrEnd,
            estimatedMinutes: resourceSeed.estimatedMinutes,
            whyRecommended: resourceSeed.whyRecommended,
            bestUseCase: resourceSeed.bestUseCase,
            followUpHint: resourceSeed.followUpHint,
            targetAudience: resourceSeed.targetAudience,
            isFeatured: resourceSeed.isFeatured ?? false,
          },
          update: {
            title: resourceSeed.title,
            sourceName: resourceSeed.sourceName,
            url: resourceSeed.url,
            description: resourceSeed.description,
            resourceType: resourceSeed.resourceType,
            resourceFormat: resourceSeed.resourceFormat,
            primaryUseCase: resourceSeed.primaryUseCase,
            accessType: resourceSeed.accessType,
            difficulty: resourceSeed.difficulty,
            cefrStart: resourceSeed.cefrStart,
            cefrEnd: resourceSeed.cefrEnd,
            estimatedMinutes: resourceSeed.estimatedMinutes,
            whyRecommended: resourceSeed.whyRecommended,
            bestUseCase: resourceSeed.bestUseCase,
            followUpHint: resourceSeed.followUpHint,
            targetAudience: resourceSeed.targetAudience,
            isFeatured: resourceSeed.isFeatured ?? false,
            isPublished: true,
          },
        });

        resourceIdBySlug.set(resourceSeed.slug, resource.id);

        await tx.resourceSkillMap.deleteMany({
          where: { resourceId: resource.id },
        });

        if (resourceSeed.skillMaps.length > 0) {
          await tx.resourceSkillMap.createMany({
            data: resourceSeed.skillMaps.map((skillMap) => ({
              resourceId: resource.id,
              skillId: requireId(
                skillIdBySlug.get(skillMap.skillSlug),
                "skill",
                skillMap.skillSlug,
              ),
              subskillId: skillMap.subskillSlug
                ? requireId(
                    subskillIdBySlug.get(skillMap.subskillSlug),
                    "subskill",
                    skillMap.subskillSlug,
                  )
                : undefined,
              emphasis: skillMap.emphasis,
            })),
          });
        }
      }

      for (const [blockSlug, blockId] of blockIdBySlug.entries()) {
        await tx.blockSkillMap.deleteMany({
          where: { roadmapBlockId: blockId },
        });

        const blockSkillMaps = blockSkillMapSeeds.filter(
          (blockSkillMap) => blockSkillMap.blockSlug === blockSlug,
        );

        if (blockSkillMaps.length > 0) {
          await tx.blockSkillMap.createMany({
            data: blockSkillMaps.map((blockSkillMap) => ({
              roadmapBlockId: blockId,
              skillId: requireId(
                skillIdBySlug.get(blockSkillMap.skillSlug),
                "skill",
                blockSkillMap.skillSlug,
              ),
              subskillId: blockSkillMap.subskillSlug
                ? requireId(
                    subskillIdBySlug.get(blockSkillMap.subskillSlug),
                    "subskill",
                    blockSkillMap.subskillSlug,
                  )
                : undefined,
              emphasis: blockSkillMap.emphasis,
            })),
          });
        }

        await tx.roadmapBlockResource.deleteMany({
          where: { roadmapBlockId: blockId },
        });

        const blockResources = blockResourceLinkSeeds.filter(
          (blockResourceLink) => blockResourceLink.blockSlug === blockSlug,
        );

        if (blockResources.length > 0) {
          await tx.roadmapBlockResource.createMany({
            data: blockResources.map((blockResourceLink) => ({
              roadmapBlockId: blockId,
              resourceId: requireId(
                resourceIdBySlug.get(blockResourceLink.resourceSlug),
                "resource",
                blockResourceLink.resourceSlug,
              ),
              role: blockResourceLink.role,
              sortOrder: blockResourceLink.sortOrder,
              note: blockResourceLink.note,
            })),
          });
        }
      }

      for (const writingTaskSeed of writingTaskSeeds) {
        await tx.writingTask.upsert({
          where: { slug: writingTaskSeed.slug },
          create: {
            slug: writingTaskSeed.slug,
            roadmapBlockId: writingTaskSeed.roadmapBlockSlug
              ? requireId(
                  blockIdBySlug.get(writingTaskSeed.roadmapBlockSlug),
                  "roadmap block",
                  writingTaskSeed.roadmapBlockSlug,
                )
              : undefined,
            title: writingTaskSeed.title,
            summary: writingTaskSeed.summary,
            instructions: writingTaskSeed.instructions,
            taskType: writingTaskSeed.taskType,
            cefrStart: writingTaskSeed.cefrStart,
            cefrEnd: writingTaskSeed.cefrEnd,
            estimatedMinutes: writingTaskSeed.estimatedMinutes,
            wordCountMin: writingTaskSeed.wordCountMin,
            wordCountMax: writingTaskSeed.wordCountMax,
            successCriteria: writingTaskSeed.successCriteria,
          },
          update: {
            roadmapBlockId: writingTaskSeed.roadmapBlockSlug
              ? requireId(
                  blockIdBySlug.get(writingTaskSeed.roadmapBlockSlug),
                  "roadmap block",
                  writingTaskSeed.roadmapBlockSlug,
                )
              : null,
            title: writingTaskSeed.title,
            summary: writingTaskSeed.summary,
            instructions: writingTaskSeed.instructions,
            taskType: writingTaskSeed.taskType,
            cefrStart: writingTaskSeed.cefrStart,
            cefrEnd: writingTaskSeed.cefrEnd,
            estimatedMinutes: writingTaskSeed.estimatedMinutes,
            wordCountMin: writingTaskSeed.wordCountMin,
            wordCountMax: writingTaskSeed.wordCountMax,
            successCriteria: writingTaskSeed.successCriteria,
            isPublished: true,
          },
        });
      }

      for (const speakingPromptSeed of speakingPromptSeeds) {
        await tx.speakingPrompt.upsert({
          where: { slug: speakingPromptSeed.slug },
          create: {
            slug: speakingPromptSeed.slug,
            roadmapBlockId: speakingPromptSeed.roadmapBlockSlug
              ? requireId(
                  blockIdBySlug.get(speakingPromptSeed.roadmapBlockSlug),
                  "roadmap block",
                  speakingPromptSeed.roadmapBlockSlug,
                )
              : undefined,
            title: speakingPromptSeed.title,
            summary: speakingPromptSeed.summary,
            promptText: speakingPromptSeed.promptText,
            promptType: speakingPromptSeed.promptType,
            cefrStart: speakingPromptSeed.cefrStart,
            cefrEnd: speakingPromptSeed.cefrEnd,
            estimatedMinutes: speakingPromptSeed.estimatedMinutes,
            targetDurationSeconds: speakingPromptSeed.targetDurationSeconds,
            prepHint: speakingPromptSeed.prepHint,
            followUpQuestion: speakingPromptSeed.followUpQuestion,
          },
          update: {
            roadmapBlockId: speakingPromptSeed.roadmapBlockSlug
              ? requireId(
                  blockIdBySlug.get(speakingPromptSeed.roadmapBlockSlug),
                  "roadmap block",
                  speakingPromptSeed.roadmapBlockSlug,
                )
              : null,
            title: speakingPromptSeed.title,
            summary: speakingPromptSeed.summary,
            promptText: speakingPromptSeed.promptText,
            promptType: speakingPromptSeed.promptType,
            cefrStart: speakingPromptSeed.cefrStart,
            cefrEnd: speakingPromptSeed.cefrEnd,
            estimatedMinutes: speakingPromptSeed.estimatedMinutes,
            targetDurationSeconds: speakingPromptSeed.targetDurationSeconds,
            prepHint: speakingPromptSeed.prepHint,
            followUpQuestion: speakingPromptSeed.followUpQuestion,
            isPublished: true,
          },
        });
      }
    },
    {
      maxWait: 10_000,
      timeout: 30_000,
    },
  );
}
