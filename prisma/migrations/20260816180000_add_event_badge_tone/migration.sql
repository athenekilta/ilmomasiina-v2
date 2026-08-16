-- CreateEnum
CREATE TYPE "BadgeTone" AS ENUM ('GREEN', 'PINK', 'DARK');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "badgeTone" "BadgeTone" NOT NULL DEFAULT 'GREEN';
