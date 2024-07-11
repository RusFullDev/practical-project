import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TranslateService } from "../translate/translate.service";
import { DistrictController } from "./district.controller";
import { DistrictService } from "./district.service";

@Module({
  controllers: [DistrictController],
  providers: [PrismaService, DistrictService, TranslateService]
})
export class DistrictModule {}