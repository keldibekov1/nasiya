/*
  Warnings:

  - The values [custumer] on the enum `Partner` will be removed. If these variants are still used in the database, this will fail.
  - The `phone` column on the `Partners` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Partner_new" AS ENUM ('seller', 'customer');
ALTER TABLE "Partners" ALTER COLUMN "role" TYPE "Partner_new" USING ("role"::text::"Partner_new");
ALTER TYPE "Partner" RENAME TO "Partner_old";
ALTER TYPE "Partner_new" RENAME TO "Partner";
DROP TYPE "Partner_old";
COMMIT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT DEFAULT ' ';

-- AlterTable
ALTER TABLE "Partners" ADD COLUMN     "location" JSONB,
DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pushSubscription" TEXT DEFAULT 'no-subscription';

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);
