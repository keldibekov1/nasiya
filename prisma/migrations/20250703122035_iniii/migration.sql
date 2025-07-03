-- DropForeignKey
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_partnerId_fkey";

-- AlterTable
ALTER TABLE "Debt" ALTER COLUMN "partnerId" DROP NOT NULL,
ALTER COLUMN "partnerId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT DEFAULT 'https';

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
