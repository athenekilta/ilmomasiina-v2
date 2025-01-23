-- CreateTable
CREATE TABLE "RaffleSimulation" (
    "id" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "seed" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "physicsState" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaffleSimulation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaffleSimulation" ADD CONSTRAINT "RaffleSimulation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
