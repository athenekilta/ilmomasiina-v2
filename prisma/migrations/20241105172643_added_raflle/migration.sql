-- CreateEnum
CREATE TYPE "SignupStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "raffleEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "raffleEndTime" TIMESTAMP(3),
ADD COLUMN     "raffleStartTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Signup" ADD COLUMN     "finalPosition" INTEGER,
ADD COLUMN     "registrationIntent" TIMESTAMP(3),
ADD COLUMN     "status" "SignupStatus" NOT NULL DEFAULT 'PENDING';
