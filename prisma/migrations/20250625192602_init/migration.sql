/*
  Warnings:

  - The values [cash,card] on the enum `Pmnt` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Pmnt_new" AS ENUM ('in', 'out');
ALTER TABLE "Payment" ALTER COLUMN "paymentType" TYPE "Pmnt_new" USING ("paymentType"::text::"Pmnt_new");
ALTER TYPE "Pmnt" RENAME TO "Pmnt_old";
ALTER TYPE "Pmnt_new" RENAME TO "Pmnt";
DROP TYPE "Pmnt_old";
COMMIT;
