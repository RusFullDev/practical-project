/*
  Warnings:

  - You are about to drop the column `Address` on the `Driver` table. All the data in the column will be lost.
  - Added the required column `address` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "Address",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "hashed_token" DROP NOT NULL,
ALTER COLUMN "hashed_password" DROP NOT NULL;
