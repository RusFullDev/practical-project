import { $Enums, TranslateType } from '@prisma/client';
import { CreateTranslateInterface } from '../interfaces';
import { IsObject, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslateDto implements CreateTranslateInterface {
  @ApiProperty({
    example: 'create_hello_translate',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: {
      uz: 'salom',
      en: 'hello',
    },
    required: true,
  })
  @IsObject()
  definition: Record<string, string>;

  @ApiProperty({
    examples: ['error', 'content'],
    enum: TranslateType,
    required: true
  })
  @IsEnum(TranslateType)
  @IsString()
  type: $Enums.TranslateType;
}