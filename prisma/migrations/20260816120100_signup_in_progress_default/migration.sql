ALTER TABLE "Signup" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

UPDATE "Signup"
SET "status" = 'IN_PROGRESS'
WHERE "status" = 'PENDING' AND "completedAt" IS NULL;

UPDATE "Signup"
SET "status" = 'WAITLISTED'
WHERE "status" = 'PENDING' AND "completedAt" IS NOT NULL;
