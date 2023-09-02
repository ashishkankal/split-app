/*
  Warnings:

  - Added the required column `amount` to the `Expenses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExpenseSplitType" AS ENUM ('EQUAL', 'PERCENTAGE', 'EXACT');

-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "splitType" "ExpenseSplitType" NOT NULL DEFAULT 'EQUAL';
