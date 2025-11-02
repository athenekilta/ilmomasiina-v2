-- AlterTable
ALTER TABLE "Signup" ADD COLUMN     "originalQuotaId" TEXT;
-- Copy values from existing column
UPDATE "Signup" SET "originalQuotaId" = "quotaId";
-- No null constraint
ALTER TABLE "Signup" ALTER COLUMN "originalQuotaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_originalQuotaId_fkey" FOREIGN KEY ("originalQuotaId") REFERENCES "Quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
