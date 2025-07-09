/*
  Warnings:

  - You are about to drop the column `productId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `sellPrice` on the `Contract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_productId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "sellPrice";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productCode" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "ContractItem" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sellPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ContractItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractItem" ADD CONSTRAINT "ContractItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractItem" ADD CONSTRAINT "ContractItem_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
