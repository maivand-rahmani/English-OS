import type { PrismaClient } from "@prisma/client";

import { speakingPromptSeeds, writingTaskSeeds } from "./curated-content/practice";
import { blockSkillMapSeeds, roadmapTemplateSeed } from "./curated-content/roadmap";
import { blockResourceLinkSeeds, resourceSeeds } from "./curated-content/resources";
import { skillSeeds } from "./curated-content/skills";

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
