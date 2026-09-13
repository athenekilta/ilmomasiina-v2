CREATE TYPE "EventImageState" AS ENUM ('PENDING', 'ATTACHED', 'RETIRED', 'DELETING');

CREATE TABLE "EventImage" (
    "id" UUID NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "EventImageState" NOT NULL DEFAULT 'PENDING',
    "deleteAfter" TIMESTAMP(3),
    CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Event" ADD COLUMN "imageId" UUID,
                    ADD COLUMN "creationRequestId" UUID;
CREATE UNIQUE INDEX "Event_imageId_key" ON "Event"("imageId");
CREATE UNIQUE INDEX "Event_creationRequestId_key" ON "Event"("creationRequestId");
CREATE INDEX "EventImage_state_deleteAfter_idx" ON "EventImage"("state", "deleteAfter");
ALTER TABLE "Event" ADD CONSTRAINT "Event_imageId_fkey"
    FOREIGN KEY ("imageId") REFERENCES "EventImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
