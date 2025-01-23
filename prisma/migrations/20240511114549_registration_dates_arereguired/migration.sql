/*
  Warnings:

  - Made the column `registrationStartDate` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registrationEndDate` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "registrationStartDate" SET NOT NULL,
ALTER COLUMN "registrationEndDate" SET NOT NULL;
