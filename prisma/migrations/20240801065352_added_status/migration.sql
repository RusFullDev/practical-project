-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('new', 'waiting', 'onroad', 'finished');

-- AlterTable
ALTER TABLE "OrderTaxi" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'new';

-- AlterTable
ALTER TABLE "OrderTruck" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'new';
