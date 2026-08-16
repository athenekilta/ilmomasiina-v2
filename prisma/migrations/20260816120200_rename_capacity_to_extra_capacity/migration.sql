ALTER TABLE "Event" RENAME COLUMN "capacity" TO "extraCapacity";
UPDATE "Event" SET "extraCapacity" = 0 WHERE "extraCapacity" IS NULL;
ALTER TABLE "Event" ALTER COLUMN "extraCapacity" SET DEFAULT 0;
ALTER TABLE "Event" ALTER COLUMN "extraCapacity" SET NOT NULL;
