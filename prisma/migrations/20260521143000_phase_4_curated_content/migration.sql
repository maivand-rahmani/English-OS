-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CefrLevel" AS ENUM ('PRE_A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "RoadmapTemplateAudience" AS ENUM ('BEGINNER_SELF_LEARNER', 'INTERMEDIATE_STUCK_SELF_LEARNER');

-- CreateEnum
CREATE TYPE "RoadmapStageType" AS ENUM ('FOUNDATION', 'COMPREHENSION', 'ACTIVE_USE', 'CONSOLIDATION');

-- CreateEnum
CREATE TYPE "RoadmapBlockType" AS ENUM ('LEARN', 'PRACTICE', 'APPLY', 'CHECKPOINT');

-- CreateEnum
CREATE TYPE "MapStrength" AS ENUM ('PRIMARY', 'SUPPORTING');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COURSE', 'VIDEO_SERIES', 'VIDEO', 'ARTICLE', 'EXERCISE_SET', 'PODCAST', 'TOOL', 'REFERENCE');

-- CreateEnum
CREATE TYPE "ResourceFormat" AS ENUM ('VIDEO', 'AUDIO', 'TEXT', 'INTERACTIVE', 'MIXED');

-- CreateEnum
CREATE TYPE "ResourceUseCase" AS ENUM ('FOUNDATION', 'PRACTICE', 'REFERENCE', 'IMMERSION', 'REVIEW');

-- CreateEnum
CREATE TYPE "ResourceAccessType" AS ENUM ('FREE', 'FREEMIUM', 'PAID');

-- CreateEnum
CREATE TYPE "ResourceDifficulty" AS ENUM ('GENTLE', 'STANDARD', 'STRETCH');

-- CreateEnum
CREATE TYPE "RoadmapBlockResourceRole" AS ENUM ('CORE', 'SUPPORTING', 'STRETCH');

-- CreateEnum
CREATE TYPE "WritingTaskType" AS ENUM ('SHORT_GUIDED_RESPONSE', 'JOURNAL_REFLECTION', 'OPINION_PARAGRAPH', 'PRACTICAL_RESPONSE');

-- CreateEnum
CREATE TYPE "SpeakingPromptType" AS ENUM ('PERSONAL_RESPONSE', 'STORYTELLING', 'OPINION', 'ROLEPLAY', 'DESCRIPTION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "current_level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subskills" (
    "id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cefr_min" "CefrLevel",
    "cefr_max" "CefrLevel",
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subskills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_templates" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audience" "RoadmapTemplateAudience" NOT NULL,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_weeks" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_stages" (
    "id" TEXT NOT NULL,
    "roadmap_template_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "purpose" TEXT,
    "stage_type" "RoadmapStageType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_weeks" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_blocks" (
    "id" TEXT NOT NULL,
    "roadmap_stage_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "purpose" TEXT,
    "why_now" TEXT,
    "block_type" "RoadmapBlockType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_minutes" INTEGER,
    "recommended_session_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_skill_maps" (
    "id" TEXT NOT NULL,
    "roadmap_block_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "subskill_id" TEXT,
    "emphasis" "MapStrength" NOT NULL DEFAULT 'PRIMARY',

    CONSTRAINT "block_skill_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "resource_type" "ResourceType" NOT NULL,
    "resource_format" "ResourceFormat" NOT NULL,
    "primary_use_case" "ResourceUseCase" NOT NULL,
    "access_type" "ResourceAccessType" NOT NULL,
    "difficulty" "ResourceDifficulty" NOT NULL,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_minutes" INTEGER,
    "why_recommended" TEXT NOT NULL,
    "best_use_case" TEXT NOT NULL,
    "follow_up_hint" TEXT,
    "target_audience" "RoadmapTemplateAudience",
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_skill_maps" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "subskill_id" TEXT,
    "emphasis" "MapStrength" NOT NULL DEFAULT 'PRIMARY',

    CONSTRAINT "resource_skill_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_block_resources" (
    "id" TEXT NOT NULL,
    "roadmap_block_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "role" "RoadmapBlockResourceRole" NOT NULL DEFAULT 'CORE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "roadmap_block_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_tasks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "roadmap_block_id" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "instructions" TEXT NOT NULL,
    "task_type" "WritingTaskType" NOT NULL,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_minutes" INTEGER,
    "word_count_min" INTEGER,
    "word_count_max" INTEGER,
    "success_criteria" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writing_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_prompts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "roadmap_block_id" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "prompt_text" TEXT NOT NULL,
    "prompt_type" "SpeakingPromptType" NOT NULL,
    "cefr_start" "CefrLevel",
    "cefr_end" "CefrLevel",
    "estimated_minutes" INTEGER,
    "target_duration_seconds" INTEGER,
    "prep_hint" TEXT,
    "follow_up_question" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speaking_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_user_id_key" ON "learner_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "skills_sort_order_idx" ON "skills"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "subskills_slug_key" ON "subskills"("slug");

-- CreateIndex
CREATE INDEX "subskills_skill_id_sort_order_idx" ON "subskills"("skill_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_templates_slug_key" ON "roadmap_templates"("slug");

-- CreateIndex
CREATE INDEX "roadmap_templates_audience_is_published_idx" ON "roadmap_templates"("audience", "is_published");

-- CreateIndex
CREATE INDEX "roadmap_stages_roadmap_template_id_sort_order_idx" ON "roadmap_stages"("roadmap_template_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_stages_roadmap_template_id_slug_key" ON "roadmap_stages"("roadmap_template_id", "slug");

-- CreateIndex
CREATE INDEX "roadmap_blocks_roadmap_stage_id_sort_order_idx" ON "roadmap_blocks"("roadmap_stage_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_blocks_roadmap_stage_id_slug_key" ON "roadmap_blocks"("roadmap_stage_id", "slug");

-- CreateIndex
CREATE INDEX "block_skill_maps_roadmap_block_id_idx" ON "block_skill_maps"("roadmap_block_id");

-- CreateIndex
CREATE INDEX "block_skill_maps_skill_id_idx" ON "block_skill_maps"("skill_id");

-- CreateIndex
CREATE INDEX "block_skill_maps_subskill_id_idx" ON "block_skill_maps"("subskill_id");

-- CreateIndex
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");

-- CreateIndex
CREATE INDEX "resources_resource_type_resource_format_idx" ON "resources"("resource_type", "resource_format");

-- CreateIndex
CREATE INDEX "resources_primary_use_case_target_audience_idx" ON "resources"("primary_use_case", "target_audience");

-- CreateIndex
CREATE INDEX "resources_cefr_start_cefr_end_idx" ON "resources"("cefr_start", "cefr_end");

-- CreateIndex
CREATE INDEX "resource_skill_maps_resource_id_idx" ON "resource_skill_maps"("resource_id");

-- CreateIndex
CREATE INDEX "resource_skill_maps_skill_id_idx" ON "resource_skill_maps"("skill_id");

-- CreateIndex
CREATE INDEX "resource_skill_maps_subskill_id_idx" ON "resource_skill_maps"("subskill_id");

-- CreateIndex
CREATE INDEX "roadmap_block_resources_resource_id_idx" ON "roadmap_block_resources"("resource_id");

-- CreateIndex
CREATE INDEX "roadmap_block_resources_roadmap_block_id_sort_order_idx" ON "roadmap_block_resources"("roadmap_block_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_block_resources_roadmap_block_id_resource_id_key" ON "roadmap_block_resources"("roadmap_block_id", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "writing_tasks_slug_key" ON "writing_tasks"("slug");

-- CreateIndex
CREATE INDEX "writing_tasks_roadmap_block_id_idx" ON "writing_tasks"("roadmap_block_id");

-- CreateIndex
CREATE INDEX "writing_tasks_task_type_cefr_start_cefr_end_idx" ON "writing_tasks"("task_type", "cefr_start", "cefr_end");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_prompts_slug_key" ON "speaking_prompts"("slug");

-- CreateIndex
CREATE INDEX "speaking_prompts_roadmap_block_id_idx" ON "speaking_prompts"("roadmap_block_id");

-- CreateIndex
CREATE INDEX "speaking_prompts_prompt_type_cefr_start_cefr_end_idx" ON "speaking_prompts"("prompt_type", "cefr_start", "cefr_end");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subskills" ADD CONSTRAINT "subskills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_stages" ADD CONSTRAINT "roadmap_stages_roadmap_template_id_fkey" FOREIGN KEY ("roadmap_template_id") REFERENCES "roadmap_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_blocks" ADD CONSTRAINT "roadmap_blocks_roadmap_stage_id_fkey" FOREIGN KEY ("roadmap_stage_id") REFERENCES "roadmap_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_skill_maps" ADD CONSTRAINT "block_skill_maps_roadmap_block_id_fkey" FOREIGN KEY ("roadmap_block_id") REFERENCES "roadmap_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_skill_maps" ADD CONSTRAINT "block_skill_maps_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_skill_maps" ADD CONSTRAINT "block_skill_maps_subskill_id_fkey" FOREIGN KEY ("subskill_id") REFERENCES "subskills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_skill_maps" ADD CONSTRAINT "resource_skill_maps_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_skill_maps" ADD CONSTRAINT "resource_skill_maps_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_skill_maps" ADD CONSTRAINT "resource_skill_maps_subskill_id_fkey" FOREIGN KEY ("subskill_id") REFERENCES "subskills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_block_resources" ADD CONSTRAINT "roadmap_block_resources_roadmap_block_id_fkey" FOREIGN KEY ("roadmap_block_id") REFERENCES "roadmap_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_block_resources" ADD CONSTRAINT "roadmap_block_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_tasks" ADD CONSTRAINT "writing_tasks_roadmap_block_id_fkey" FOREIGN KEY ("roadmap_block_id") REFERENCES "roadmap_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_prompts" ADD CONSTRAINT "speaking_prompts_roadmap_block_id_fkey" FOREIGN KEY ("roadmap_block_id") REFERENCES "roadmap_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
