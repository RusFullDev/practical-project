import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Cargo_type } from '@prisma/client';

export class CreateOrderTruckDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ enum: Cargo_type })
  @IsEnum(Cargo_type)
  cargo_type: Cargo_type;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsNumber()
  capacity: number;

  @ApiProperty()
  @IsString()
  recipient_name: string;

  @ApiProperty()
  @IsString()
  recipient_phone: string;

  @ApiProperty()
  @IsString()
  to_district: string;

  @ApiProperty()
  @IsString()
  from_district: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  description: string;
}
