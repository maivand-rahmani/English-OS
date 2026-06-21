import type { DashboardContentState, DashboardSkill } from "@/entities/dashboard";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

type BlockWithRelations = NonNullable<
  Awaited<ReturnType<typeof getTemplateRecord>>
>["stages"][number]["blocks"][number];

export async function getDashboardState(): Promise<DashboardContentState> {
  if (!prisma) {
    return getEmptyDashboardState();
  }

  const [session, template] = await Promise.all([auth(), getTemplateRecord()]);

  if (!template) {
    return getEmptyDashboardState();
  }

  const learnerProfile =
    session?.user?.email != null
      ? await prisma.learnerProfile.findFirst({
          where: {
            user: {
              email: session.user.email,
            },
          },
          select: {
            currentLevel: true,
          },
        })
      : null;

  const stages = template.stages.map((stage) => ({
    id: stage.id,
    slug: stage.slug,
    title: stage.title,
    summary: stage.summary,
    purpose: stage.purpose,
    stageTypeLabel: humanizeEnum(stage.stageType),
    estimatedWeeks: stage.estimatedWeeks,
    cefrLabel: formatCefrRange(stage.cefrStart, stage.cefrEnd),
    blocks: stage.blocks.map((block) => ({
      id: block.id,
      slug: block.slug,
      title: block.title,
      summary: block.summary,
      purpose: block.purpose,
      whyNow: block.whyNow,
      estimatedMinutes: block.estimatedMinutes,
      recommendedSessionCount: block.recommendedSessionCount,
      cefrLabel: formatCefrRange(block.cefrStart, block.cefrEnd),
      stageId: stage.id,
      stageTitle: stage.title,
      stageSummary: stage.summary,
      stageTypeLabel: humanizeEnum(stage.stageType),
      blockTypeLabel: humanizeEnum(block.blockType),
      skills: mapBlockSkills(block),
      resources: block.resourceLinks.map((resourceLink) => ({
        id: resourceLink.resource.id,
        slug: resourceLink.resource.slug,
        title: resourceLink.resource.title,
        sourceName: resourceLink.resource.sourceName,
        resourceTypeLabel: humanizeEnum(resourceLink.resource.resourceType),
        resourceFormatLabel: humanizeEnum(resourceLink.resource.resourceFormat),
        primaryUseCaseLabel: humanizeEnum(
          resourceLink.resource.primaryUseCase,
        ),
        estimatedMinutes: resourceLink.resource.estimatedMinutes,
        whyRecommended: resourceLink.resource.whyRecommended,
        bestUseCase: resourceLink.resource.bestUseCase,
        followUpHint: resourceLink.resource.followUpHint,
        note: resourceLink.note,
        role: resourceRoleLabel(resourceLink.role),
        skills: mapResourceSkills(resourceLink.resource.skillMaps),
        isFeatured: resourceLink.resource.isFeatured,
        url: resourceLink.resource.url,
        description: resourceLink.resource.description,
        accessTypeLabel: humanizeEnum(resourceLink.resource.accessType),
        difficultyLabel: humanizeEnum(resourceLink.resource.difficulty),
        cefrLabel: formatCefrRange(
          resourceLink.resource.cefrStart,
          resourceLink.resource.cefrEnd,
        ),
      })),
      writingTasks: block.writingTasks.map((task) => ({
        id: task.id,
        slug: task.slug,
        title: task.title,
        summary: task.summary,
        estimatedMinutes: task.estimatedMinutes,
        wordCountMin: task.wordCountMin,
        wordCountMax: task.wordCountMax,
        blockTitle: block.title,
        instructions: task.instructions,
        successCriteria: task.successCriteria,
      })),
      speakingPrompts: block.speakingPrompts.map((prompt) => ({
        id: prompt.id,
        slug: prompt.slug,
        title: prompt.title,
        summary: prompt.summary,
        promptText: prompt.promptText,
        estimatedMinutes: prompt.estimatedMinutes,
        targetDurationSeconds: prompt.targetDurationSeconds,
        blockTitle: block.title,
        prepHint: prompt.prepHint,
        followUpQuestion: prompt.followUpQuestion,
      })),
    })),
  }));

  const resourceIds = new Set<string>();
  for (const stage of stages) {
    for (const block of stage.blocks) {
      for (const resource of block.resources) {
        resourceIds.add(resource.id);
      }
    }
  }

  const firstBlock = stages.flatMap((stage) => stage.blocks)[0];

  return {
    displayName:
      session?.user?.name ??
      session?.user?.email?.split("@")[0] ??
      "Learner",
    learnerLevelLabel:
      learnerProfile?.currentLevel ??
      firstBlock?.cefrLabel ??
      formatCefrRange(template.cefrStart, template.cefrEnd) ??
      "Starter path",
    goalLabel: audienceGoalLabel(template.audience),
    templateTitle: template.title,
    templateDescription: template.description,
    audienceLabel: audienceLabel(template.audience),
    estimatedWeeks: template.estimatedWeeks,
    stageCount: stages.length,
    blockCount: stages.reduce((total, stage) => total + stage.blocks.length, 0),
    resourceCount: resourceIds.size,
    stages,
  };
}

function getTemplateRecord() {
  if (!prisma) {
    return Promise.resolve(null);
  }

  return prisma.roadmapTemplate.findFirst({
    where: {
      isDefault: true,
      isPublished: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      stages: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          blocks: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              skillMaps: {
                include: {
                  skill: true,
                },
              },
              resourceLinks: {
                orderBy: {
                  sortOrder: "asc",
                },
                include: {
                  resource: {
                    include: {
                      skillMaps: {
                        include: {
                          skill: true,
                        },
                      },
                    },
                  },
                },
              },
              writingTasks: {
                where: {
                  isPublished: true,
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
              speakingPrompts: {
                where: {
                  isPublished: true,
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      },
    },
  });
}

function mapBlockSkills(block: BlockWithRelations): DashboardSkill[] {
  const deduped = new Map<string, DashboardSkill>();

  for (const skillMap of block.skillMaps) {
    deduped.set(skillMap.skill.slug, {
      slug: skillMap.skill.slug,
      title: skillMap.skill.title,
      emphasis: skillMap.emphasis === "PRIMARY" ? "primary" : "supporting",
    });
  }

  return [...deduped.values()];
}

function mapResourceSkills(
  skillMaps: Array<{
    skill: {
      slug: string;
      title: string;
    };
    emphasis: "PRIMARY" | "SUPPORTING";
  }>,
): DashboardSkill[] {
  const deduped = new Map<string, DashboardSkill>();

  for (const skillMap of skillMaps) {
    deduped.set(skillMap.skill.slug, {
      slug: skillMap.skill.slug,
      title: skillMap.skill.title,
      emphasis: skillMap.emphasis === "PRIMARY" ? "primary" : "supporting",
    });
  }

  return [...deduped.values()];
}

function humanizeEnum(value: string) {
  return value.toLowerCase().split("_").join(" ");
}

function audienceLabel(value: string) {
  switch (value) {
    case "BEGINNER_SELF_LEARNER":
      return "Beginner self-learner";
    case "INTERMEDIATE_STUCK_SELF_LEARNER":
      return "Intermediate learner who feels stuck";
    default:
      return humanizeEnum(value);
  }
}

function audienceGoalLabel(value: string) {
  switch (value) {
    case "BEGINNER_SELF_LEARNER":
      return "Build a safe English foundation with a clear daily path.";
    case "INTERMEDIATE_STUCK_SELF_LEARNER":
      return "Break stagnation with more selective practice and stronger output.";
    default:
      return "Build a clearer and more sustainable English study system.";
  }
}

function resourceRoleLabel(
  value: string,
): "core" | "supporting" | "stretch" {
  switch (value) {
    case "CORE":
      return "core";
    case "STRETCH":
      return "stretch";
    default:
      return "supporting";
  }
}

function formatCefrRange(start: string | null, end: string | null) {
  if (start && end && start !== end) {
    return `${formatCefrValue(start)} to ${formatCefrValue(end)}`;
  }

  if (start) {
    return formatCefrValue(start);
  }

  if (end) {
    return formatCefrValue(end);
  }

  return null;
}

function formatCefrValue(value: string) {
  return value === "PRE_A1" ? "Pre-A1" : value;
}

function getEmptyDashboardState(): DashboardContentState {
  return {
    displayName: "Learner",
    learnerLevelLabel: "Starter path",
    goalLabel: "Load curated content to unlock a daily plan and next actions.",
    templateTitle: "Dashboard content unavailable",
    templateDescription:
      "The dashboard can still load, but no curated roadmap template is available yet.",
    audienceLabel: "Curated content pending",
    estimatedWeeks: null,
    stageCount: 0,
    blockCount: 0,
    resourceCount: 0,
    stages: [],
  };
}
