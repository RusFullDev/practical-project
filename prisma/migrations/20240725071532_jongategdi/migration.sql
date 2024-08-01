-- DropForeignKey
ALTER TABLE "Driver_car" DROP CONSTRAINT "Driver_car_carId_fkey";

-- DropForeignKey
ALTER TABLE "Driver_car" DROP CONSTRAINT "Driver_car_driverId_fkey";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "photo" DROP NOT NULL,
ALTER COLUMN "driver_license" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
