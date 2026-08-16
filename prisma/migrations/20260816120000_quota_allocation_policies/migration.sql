CREATE TYPE "AllocationPolicy" AS ENUM ('FIXED', 'IMMEDIATE', 'AFTER_CLOSE');

ALTER TYPE "SignupStatus" ADD VALUE 'IN_PROGRESS' BEFORE 'PENDING';
ALTER TYPE "SignupStatus" ADD VALUE 'WAITLISTED' AFTER 'CONFIRMED';

ALTER TABLE "Event" ADD COLUMN "capacity" INTEGER;
ALTER TABLE "Quota" ADD COLUMN "allocationPolicy" "AllocationPolicy" NOT NULL DEFAULT 'FIXED';
ALTER TABLE "Signup" ADD COLUMN "allocatedAt" TIMESTAMP(3);

UPDATE "Signup"
SET "allocatedAt" = COALESCE("completedAt", "createdAt")
WHERE "status" = 'CONFIRMED';
