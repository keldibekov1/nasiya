-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "partnerId" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
