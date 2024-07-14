/*
  Warnings:

  - You are about to drop the column `regionId` on the `District` table. All the data in the column will be lost.
  - Added the required column `region_id` to the `District` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_regionId_fkey";

-- AlterTable
ALTER TABLE "District" DROP COLUMN "regionId",
ADD COLUMN     "region_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
