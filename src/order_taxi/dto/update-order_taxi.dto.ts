import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdateOrderTaxiDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  driverId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  from_district?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  to_district?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
