import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderTruckDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2024-08-03T05:49:03Z' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: 10 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: 'Gofur' })
  @IsString()
  recipient_name: string;

  @ApiProperty({ example: '934554676' })
  @IsString()
  recipient_phone: string;

  @ApiProperty({ example: 'jizzax' })
  @IsString()
  to_district: string;

  @ApiProperty({ example: 'toshkent' })
  @IsString()
  from_district: string;

  @ApiProperty({ example: 'komentaria' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'lat,lang' })
  @IsString()
  location: string;
}
