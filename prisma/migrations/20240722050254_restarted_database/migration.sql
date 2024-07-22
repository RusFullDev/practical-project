/*
  Warnings:

  - Changed the type of `name` on the `District` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Region` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "District" DROP COLUMN "name",
ADD COLUMN     "name" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "name",
ADD COLUMN     "name" INTEGER NOT NULL;
