/*
  Warnings:

  - The primary key for the `definition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `definition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `language` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `language` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `translate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `translate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `translate_id` on the `definition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language_id` on the `definition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "definition" DROP CONSTRAINT "definition_language_id_fkey";

-- DropForeignKey
ALTER TABLE "definition" DROP CONSTRAINT "definition_translate_id_fkey";

-- AlterTable
ALTER TABLE "definition" DROP CONSTRAINT "definition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "translate_id",
ADD COLUMN     "translate_id" INTEGER NOT NULL,
DROP COLUMN "language_id",
ADD COLUMN     "language_id" INTEGER NOT NULL,
ADD CONSTRAINT "definition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "language" DROP CONSTRAINT "language_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "language_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "translate" DROP CONSTRAINT "translate_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "translate_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_translate_id_fkey" FOREIGN KEY ("translate_id") REFERENCES "translate"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
