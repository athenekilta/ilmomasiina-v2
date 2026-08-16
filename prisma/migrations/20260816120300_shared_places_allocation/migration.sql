ALTER TYPE "AllocationPolicy" RENAME TO "SharedPlacesAllocation";
ALTER TYPE "SharedPlacesAllocation" RENAME VALUE 'FIXED' TO 'NEVER';
ALTER TYPE "SharedPlacesAllocation" RENAME VALUE 'AFTER_CLOSE' TO 'AFTER_REGISTRATION_CLOSE';
ALTER TABLE "Quota" RENAME COLUMN "allocationPolicy" TO "sharedPlacesAllocation";
ALTER TABLE "Quota" ALTER COLUMN "sharedPlacesAllocation" SET DEFAULT 'NEVER';
