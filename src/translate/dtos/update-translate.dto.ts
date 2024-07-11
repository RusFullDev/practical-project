import { $Enums } from '@prisma/client';
import { UpdateTranslateRequest } from '../interfaces';
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTranslateDto implements Omit<UpdateTranslateRequest, 'id'> {
  @ApiProperty({
    example: {
      uz: 'salom',
      en: 'hello',
    },
    required: true,
  })
  @IsOptional()
  @IsObject()
  definition?: Record<string, string>;
}