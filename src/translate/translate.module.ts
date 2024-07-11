import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';

@Module({
  controllers: [TranslateController],
  providers: [PrismaService, TranslateService],
})
export class TranslateModule {}