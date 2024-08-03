-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "history" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "history" TEXT NOT NULL DEFAULT '';
