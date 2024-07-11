import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TranslateService } from "../translate/translate.service";
import { RegionController } from "./region.controller";
import { RegionService } from "./region.service";

@Module({
  controllers: [RegionController],
  providers: [PrismaService,RegionService, TranslateService]
})
export class RegionModule {}