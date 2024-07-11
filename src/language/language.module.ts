import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LanguageController } from "./language.controller";
import { LanguageService } from "./language.service";

@Module({
  controllers: [LanguageController],
  providers: [PrismaService,LanguageService]
})
export class LanguageModule {}