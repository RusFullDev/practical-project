import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateDistrictRequest } from '../interfaces';

export class UpdateDistrictDto implements Omit<UpdateDistrictRequest, 'id'> {
  @ApiProperty({
    example: "Buxara",
    required: false
  })
  @IsOptional()
  @IsString()
  name: string;
}