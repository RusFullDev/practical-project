/*
  Warnings:

  - You are about to drop the column `car_id` on the `Driver_car` table. All the data in the column will be lost.
  - You are about to drop the column `driver_id` on the `Driver_car` table. All the data in the column will be lost.
  - Added the required column `carId` to the `Driver_car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverId` to the `Driver_car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Driver_car" DROP CONSTRAINT "Driver_car_car_id_fkey";

-- DropForeignKey
ALTER TABLE "Driver_car" DROP CONSTRAINT "Driver_car_driver_id_fkey";

-- AlterTable
ALTER TABLE "Driver_car" DROP COLUMN "car_id",
DROP COLUMN "driver_id",
ADD COLUMN     "carId" INTEGER NOT NULL,
ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "is_active" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
