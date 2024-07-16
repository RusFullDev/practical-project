/*
  Warnings:

  - Added the required column `distance` to the `OrderTaxi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `OrderTaxi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `OrderTruck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `OrderTruck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderTaxi" ADD COLUMN     "distance" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderTruck" ADD COLUMN     "distance" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL;
