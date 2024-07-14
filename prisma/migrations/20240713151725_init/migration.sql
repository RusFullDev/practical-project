/*
  Warnings:

  - You are about to drop the column `region_id` on the `District` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `District` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_region_id_fkey";

-- AlterTable
ALTER TABLE "District" DROP COLUMN "region_id",
ADD COLUMN     "regionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
