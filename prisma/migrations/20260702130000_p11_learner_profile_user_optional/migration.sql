-- Make user_id nullable so guest profiles (no User row) can be created
-- with only a guestId. Authenticated users still get a non-null user_id.
ALTER TABLE "learner_profiles" ALTER COLUMN "user_id" DROP NOT NULL;
