import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';


export class CreateOrderTruckDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2001-01-01' })
  @IsDate()
  @Type(() => Date)
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

  @ApiProperty({ example: 'djizzakh' })
  @IsString()
  to_district: string;

  @ApiProperty({ example: 'tashkent' })
  @IsString()
  from_district: string;

  @ApiProperty({ example: 'komentaria' })
  @IsString()
  description: string;
}
