export enum TransferType {
  Taxi = 'taxi',
  Truck = 'truck',
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsInt,
  IsDate,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class UpdateBalanceDto {
  @ApiProperty({ example: 100.5, description: 'The amount of the balance' })
  @IsNumber()
  @Min(0.01) // Example validation rule: Minimum value for amount
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 1, description: 'The ID of the driver' })
  @IsInt()
  @IsOptional()
  driver_id?: number;

  @ApiProperty({
    example: '2024-07-10T08:00:00.000Z',
    description: 'The date of the balance transfer',
  })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({
    enum: TransferType,
    example: TransferType.Taxi,
    description: 'The type of transfer (taxi or truck)',
  })
  @IsEnum(TransferType)
  @IsOptional()
  transfer_type?: TransferType;
}
