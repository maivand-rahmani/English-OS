import type { DashboardSkill } from "@/entities/dashboard";
import type { ResourcesPageData } from "@/entities/resources";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

type ResourceTemplate = NonNullable<
  Awaited<ReturnType<typeof getDefaultTemplateRecord>>
>;

export async function getResourcesPageData(): Promise<ResourcesPageData> {
  if (!prisma) {
    return getEmptyResourcesPageData();
  }

  const [session, template] = await Promise.all([auth(), getDefaultTemplateRecord()]);

  if (!template) {
    return getEmptyResourcesPageData();
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

  const resources = new Map<string, ResourcesPageData["resources"][number]>();

  for (const stage of template.stages) {
    for (const block of stage.blocks) {
      for (const resourceLink of block.resourceLinks) {
        if (!resourceLink.resource.isPublished) {
          continue;
        }

        const roadmapLink = {
          blockId: block.id,
          blockSlug: block.slug,
          blockTitle: block.title,
          note: resourceLink.note,
          role: resourceRoleLabel(resourceLink.role),
          stageId: stage.id,
          stageTitle: stage.title,
        } as const;

        const existing = resources.get(resourceLink.resource.id);

        if (existing) {
          existing.roadmapLinks.push(roadmapLink);
          continue;
        }

        resources.set(resourceLink.resource.id, {
          accessTypeLabel: humanizeEnum(resourceLink.resource.accessType),
          bestUseCase: resourceLink.resource.bestUseCase,
          cefrLabel: formatCefrRange(
            resourceLink.resource.cefrStart,
            resourceLink.resource.cefrEnd,
          ),
          description: resourceLink.resource.description,
          difficultyLabel: humanizeEnum(resourceLink.resource.difficulty),
          estimatedMinutes: resourceLink.resource.estimatedMinutes,
          followUpHint: resourceLink.resource.followUpHint,
          id: resourceLink.resource.id,
          isFeatured: resourceLink.resource.isFeatured,
          primaryUseCaseLabel: humanizeEnum(resourceLink.resource.primaryUseCase),
          resourceFormatLabel: humanizeEnum(resourceLink.resource.resourceFormat),
          resourceTypeLabel: humanizeEnum(resourceLink.resource.resourceType),
          roadmapLinks: [roadmapLink],
          skills: mapResourceSkills(resourceLink.resource.skillMaps),
          slug: resourceLink.resource.slug,
          sourceName: resourceLink.resource.sourceName,
          title: resourceLink.resource.title,
          url: resourceLink.resource.url,
          whyRecommended: resourceLink.resource.whyRecommended,
        });
      }
    }
  }

  const firstResource = [...resources.values()][0];

  return {
    audienceLabel: audienceLabel(template.audience),
    estimatedWeeks: template.estimatedWeeks,
    goalLabel: audienceGoalLabel(template.audience),
    learnerLevelLabel:
      learnerProfile?.currentLevel ??
      firstResource?.cefrLabel ??
      formatCefrRange(template.cefrStart, template.cefrEnd) ??
      "Starter path",
    resourceCount: resources.size,
    resources: [...resources.values()],
    templateDescription: template.description,
    templateTitle: template.title,
  };
}

function getDefaultTemplateRecord() {
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
            },
          },
        },
      },
    },
  });
}

function mapResourceSkills(
  skillMaps: ResourceTemplate["stages"][number]["blocks"][number]["resourceLinks"][number]["resource"]["skillMaps"],
): DashboardSkill[] {
  const deduped = new Map<string, DashboardSkill>();

  for (const skillMap of skillMaps) {
    deduped.set(skillMap.skill.slug, {
      emphasis: skillMap.emphasis === "PRIMARY" ? "primary" : "supporting",
      slug: skillMap.skill.slug,
      title: skillMap.skill.title,
    });
  }

  return [...deduped.values()];
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

function humanizeEnum(value: string) {
  return value.toLowerCase().split("_").join(" ");
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

function getEmptyResourcesPageData(): ResourcesPageData {
  return {
    audienceLabel: "Curated content pending",
    estimatedWeeks: null,
    goalLabel: "Load curated resources to unlock a calmer discovery surface.",
    learnerLevelLabel: "Starter path",
    resourceCount: 0,
    resources: [],
    templateDescription: "Resources are unavailable until the default roadmap is published.",
    templateTitle: "Resources unavailable",
  };
}
