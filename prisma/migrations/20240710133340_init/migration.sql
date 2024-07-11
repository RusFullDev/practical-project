/*
  Warnings:

  - Added the required column `date` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
