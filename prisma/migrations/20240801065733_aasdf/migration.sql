/*
  Warnings:

  - The `status` column on the `OrderTaxi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `OrderTruck` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('new', 'waiting', 'onroad', 'finished');

-- AlterTable
ALTER TABLE "OrderTaxi" DROP COLUMN "status",
ADD COLUMN     "status" "order_status" NOT NULL DEFAULT 'new';

-- AlterTable
ALTER TABLE "OrderTruck" DROP COLUMN "status",
ADD COLUMN     "status" "order_status" NOT NULL DEFAULT 'new';

-- DropEnum
DROP TYPE "OrderStatus";
