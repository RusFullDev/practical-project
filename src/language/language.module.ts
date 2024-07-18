import { Module } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { LanguageController } from "./language.controller";
import { LanguageService } from "./language.service";

@Module({
  controllers: [LanguageController],
  providers: [PrismaService,LanguageService, CloudinaryService]
})
export class LanguageModule {}