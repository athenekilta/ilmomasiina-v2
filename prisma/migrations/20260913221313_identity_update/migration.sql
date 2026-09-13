/*
  Warnings:

  - You are about to drop the column `raffleEnabled` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `raffleEndTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `raffleStartTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `raffleStatus` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Signup` table. All the data in the column will be lost.
  - You are about to drop the column `registrationIntent` on the `Signup` table. All the data in the column will be lost.
  - You are about to drop the `RaffleSimulation` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `identityId` on table `Signup` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RaffleSimulation" DROP CONSTRAINT "RaffleSimulation_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Signup" DROP CONSTRAINT "Signup_identityId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "raffleEnabled",
DROP COLUMN "raffleEndTime",
DROP COLUMN "raffleStartTime",
DROP COLUMN "raffleStatus";

-- AlterTable
ALTER TABLE "Signup" DROP COLUMN "email",
DROP COLUMN "registrationIntent",
ALTER COLUMN "identityId" SET NOT NULL;

-- DropTable
DROP TABLE "RaffleSimulation";

-- DropEnum
DROP TYPE "RaffleStatus";

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
