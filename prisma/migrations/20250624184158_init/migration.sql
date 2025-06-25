-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
