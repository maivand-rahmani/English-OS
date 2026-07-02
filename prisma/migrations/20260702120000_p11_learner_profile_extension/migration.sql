-- CreateEnum
CREATE TYPE "MainGoal" AS ENUM ('BUILD_FOUNDATION', 'SPEAK_MORE_CONFIDENTLY', 'STUDY_MORE_CONSISTENTLY', 'IMPROVE_COMPREHENSION', 'IMPROVE_WRITING_EXPRESSION');

-- CreateEnum
CREATE TYPE "PainPoint" AS ENUM ('TOO_MANY_RESOURCES', 'NO_STRUCTURE', 'FORGETS_WHAT_LEARNED', 'LOW_CONFIDENCE_SPEAKING', 'NO_PROGRESS_VISIBILITY', 'OTHER');

-- AlterTable
ALTER TABLE "learner_profiles" ADD COLUMN     "completed_onboarding_at" TIMESTAMP(3),
ADD COLUMN     "guest_id" TEXT,
ADD COLUMN     "main_goal" "MainGoal",
ADD COLUMN     "main_pain_point" "PainPoint",
ADD COLUMN     "preferred_formats" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strongest_skill" TEXT,
ADD COLUMN     "study_minutes_per_day" INTEGER,
ADD COLUMN     "weakest_skill" TEXT,
ALTER COLUMN "display_name" SET DEFAULT 'Learner';

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_guest_id_key" ON "learner_profiles"("guest_id");
