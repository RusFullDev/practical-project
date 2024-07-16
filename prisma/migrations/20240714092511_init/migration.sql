-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Role_Type" AS ENUM ('teacher', 'admin', 'user');

-- CreateEnum
CREATE TYPE "Cargo_type" AS ENUM ('post', 'load');

-- CreateEnum
CREATE TYPE "Transfer_type" AS ENUM ('input', 'output');

-- CreateEnum
CREATE TYPE "translate_type" AS ENUM ('error', 'content');

-- CreateTable
CREATE TABLE "language" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "code" VARCHAR(2) NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "image_url" VARCHAR NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translate" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "code" VARCHAR NOT NULL,
    "type" "translate_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "translate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "definition" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "translate_id" UUID NOT NULL,
    "language_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role_Type" NOT NULL DEFAULT 'user',
    "hashed_password" TEXT NOT NULL,
    "hashed_token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTaxi" (
    "id" SERIAL NOT NULL,
    "to_district" TEXT NOT NULL,
    "from_district" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "OrderTaxi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTruck" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "cargo_type" "Cargo_type" NOT NULL DEFAULT 'load',
    "date" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "recipient_phone" TEXT NOT NULL,
    "to_district" TEXT NOT NULL,
    "from_district" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "OrderTruck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "driver_license" TEXT NOT NULL,
    "is_active" BOOLEAN,
    "hashed_token" TEXT,
    "hashed_password" TEXT,
    "total_balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "driverId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "trunsfer_type" "Transfer_type" NOT NULL DEFAULT 'input',

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "text_passport" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver_car" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "Driver_car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "language_code_key" ON "language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "translate_code_key" ON "translate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phone_key" ON "Driver"("phone");

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_translate_id_fkey" FOREIGN KEY ("translate_id") REFERENCES "translate"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "definition" ADD CONSTRAINT "definition_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderTaxi" ADD CONSTRAINT "OrderTaxi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTruck" ADD CONSTRAINT "OrderTruck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_car" ADD CONSTRAINT "Driver_car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
