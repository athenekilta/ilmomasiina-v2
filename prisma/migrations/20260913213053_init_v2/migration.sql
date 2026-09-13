-- CreateEnum
CREATE TYPE "ManagementRole" AS ENUM ('user', 'event_editor', 'superadmin');

-- CreateEnum
CREATE TYPE "BadgeTone" AS ENUM ('GREEN', 'PINK', 'DARK');

-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('NOT_STARTED', 'REGISTRATION_OPEN', 'SIMULATING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EventImageState" AS ENUM ('PENDING', 'ATTACHED', 'RETIRED', 'DELETING');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('text', 'textarea', 'radio', 'checkbox');

-- CreateEnum
CREATE TYPE "SignupStatus" AS ENUM ('IN_PROGRESS', 'PENDING', 'CONFIRMED', 'WAITLISTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SharedPlacesAllocation" AS ENUM ('NEVER', 'IMMEDIATE', 'AFTER_REGISTRATION_CLOSE');

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "ManagementRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementAccount" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementSession" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ManagementSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementVerification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordChangeToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "PasswordChangeToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventImage" (
    "id" UUID NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "EventImageState" NOT NULL DEFAULT 'PENDING',
    "deleteAfter" TIMESTAMP(3),

    CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "imageId" UUID,
    "creationRequestId" UUID,
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "badgeText" TEXT,
    "badgeTone" "BadgeTone" NOT NULL DEFAULT 'GREEN',
    "date" TIMESTAMP(3) NOT NULL,
    "registrationStartDate" TIMESTAMP(3) NOT NULL,
    "registrationEndDate" TIMESTAMP(3) NOT NULL,
    "openQuotaSize" INTEGER NOT NULL DEFAULT 0,
    "extraCapacity" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "price" TEXT,
    "location" TEXT,
    "webpageUrl" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "signupsPublic" BOOLEAN NOT NULL DEFAULT false,
    "verificationEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "raffleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "raffleStartTime" TIMESTAMP(3),
    "raffleEndTime" TIMESTAMP(3),
    "raffleStatus" "RaffleStatus" NOT NULL DEFAULT 'NOT_STARTED',

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'text',
    "sortId" INTEGER NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "required" BOOLEAN NOT NULL DEFAULT true,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "signupId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quotaId" TEXT NOT NULL,
    "originalQuotaId" TEXT NOT NULL,
    "registrationIntent" TIMESTAMP(3),
    "status" "SignupStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "allocatedAt" TIMESTAMP(3),
    "identityId" TEXT,

    CONSTRAINT "Signup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignupGrant" (
    "id" TEXT NOT NULL,
    "signupId" TEXT NOT NULL,

    CONSTRAINT "SignupGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityGrant" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,

    CONSTRAINT "IdentityGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "signupGrantId" TEXT,
    "identityGrantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Quota" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "size" INTEGER,
    "sharedPlacesAllocation" "SharedPlacesAllocation" NOT NULL DEFAULT 'NEVER',
    "sortId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SignupGrantToUserSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SignupGrantToUserSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IdentityGrantToUserSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_IdentityGrantToUserSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagementUser_email_key" ON "ManagementUser"("email");

-- CreateIndex
CREATE INDEX "ManagementAccount_userId_idx" ON "ManagementAccount"("userId");

-- CreateIndex
CREATE INDEX "ManagementSession_userId_idx" ON "ManagementSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementSession_token_key" ON "ManagementSession"("token");

-- CreateIndex
CREATE INDEX "ManagementVerification_identifier_idx" ON "ManagementVerification"("identifier");

-- CreateIndex
CREATE INDEX "EventImage_state_deleteAfter_idx" ON "EventImage"("state", "deleteAfter");

-- CreateIndex
CREATE UNIQUE INDEX "Event_imageId_key" ON "Event"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_creationRequestId_key" ON "Event"("creationRequestId");

-- CreateIndex
CREATE INDEX "Question_eventId_idx" ON "Question"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_signupId_questionId_key" ON "Answer"("signupId", "questionId");

-- CreateIndex
CREATE INDEX "Signup_quotaId_idx" ON "Signup"("quotaId");

-- CreateIndex
CREATE INDEX "Signup_identityId_idx" ON "Signup"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "Identity_email_key" ON "Identity"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_tokenHash_key" ON "UserSession"("tokenHash");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SignupGrant_signupId_key" ON "SignupGrant"("signupId");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityGrant_identityId_key" ON "IdentityGrant"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenHash_key" ON "Token"("tokenHash");

-- CreateIndex
CREATE INDEX "Token_signupGrantId_idx" ON "Token"("signupGrantId");

-- CreateIndex
CREATE INDEX "Token_identityGrantId_idx" ON "Token"("identityGrantId");

-- CreateIndex
CREATE INDEX "Token_expiresAt_idx" ON "Token"("expiresAt");

-- CreateIndex
CREATE INDEX "Quota_eventId_idx" ON "Quota"("eventId");

-- CreateIndex
CREATE INDEX "_SignupGrantToUserSession_B_index" ON "_SignupGrantToUserSession"("B");

-- CreateIndex
CREATE INDEX "_IdentityGrantToUserSession_B_index" ON "_IdentityGrantToUserSession"("B");

-- AddForeignKey
ALTER TABLE "ManagementAccount" ADD CONSTRAINT "ManagementAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ManagementUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementSession" ADD CONSTRAINT "ManagementSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ManagementUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "EventImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_signupId_fkey" FOREIGN KEY ("signupId") REFERENCES "Signup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "Quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_originalQuotaId_fkey" FOREIGN KEY ("originalQuotaId") REFERENCES "Quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignupGrant" ADD CONSTRAINT "SignupGrant_signupId_fkey" FOREIGN KEY ("signupId") REFERENCES "Signup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityGrant" ADD CONSTRAINT "IdentityGrant_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_signupGrantId_fkey" FOREIGN KEY ("signupGrantId") REFERENCES "SignupGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_identityGrantId_fkey" FOREIGN KEY ("identityGrantId") REFERENCES "IdentityGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaffleSimulation" ADD CONSTRAINT "RaffleSimulation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quota" ADD CONSTRAINT "Quota_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignupGrantToUserSession" ADD CONSTRAINT "_SignupGrantToUserSession_A_fkey" FOREIGN KEY ("A") REFERENCES "SignupGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignupGrantToUserSession" ADD CONSTRAINT "_SignupGrantToUserSession_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityGrantToUserSession" ADD CONSTRAINT "_IdentityGrantToUserSession_A_fkey" FOREIGN KEY ("A") REFERENCES "IdentityGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdentityGrantToUserSession" ADD CONSTRAINT "_IdentityGrantToUserSession_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
