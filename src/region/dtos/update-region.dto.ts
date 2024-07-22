import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateRegionRequest } from '../interfaces';

export class UpdateLanguageDto implements Omit<UpdateRegionRequest, 'id'> {
  @ApiProperty({
    example: "Buxoro",
    required: false
  })
  @IsOptional()
  name: number;
}