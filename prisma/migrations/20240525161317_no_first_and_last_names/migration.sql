/*
  Warnings:

  - You are about to drop the column `firstName` on the `Signup` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Signup` table. All the data in the column will be lost.
  - Added the required column `name` to the `Signup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signup" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;
