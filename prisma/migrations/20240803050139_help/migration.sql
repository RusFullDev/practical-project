-- AlterTable
ALTER TABLE "OrderTaxi" ADD COLUMN     "driverId" INTEGER;

-- AlterTable
ALTER TABLE "OrderTruck" ADD COLUMN     "driverId" INTEGER;

-- AddForeignKey
ALTER TABLE "OrderTaxi" ADD CONSTRAINT "OrderTaxi_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTruck" ADD CONSTRAINT "OrderTruck_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
