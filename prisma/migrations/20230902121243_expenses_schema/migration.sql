-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "payeeId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "splits" JSONB,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
