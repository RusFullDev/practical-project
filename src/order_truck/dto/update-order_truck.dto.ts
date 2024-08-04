import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderTruckDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  driverId?: number;

  @ApiProperty({ example: '2001-01-01' })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ example: 'Gofur' })
  @IsString()
  @IsOptional()
  recipient_name?: string;

  @ApiProperty({ example: '934554676' })
  @IsString()
  @IsOptional()
  recipient_phone?: string;

  @ApiProperty({ example: 'djizzakh' })
  @IsString()
  @IsOptional()
  to_district?: string;

  @ApiProperty({ example: 'tashkent' })
  @IsString()
  @IsOptional()
  from_district?: string;

  @ApiProperty({ example: 'komentaria' })
  @IsString()
  @IsOptional()
  description?: string;
}
