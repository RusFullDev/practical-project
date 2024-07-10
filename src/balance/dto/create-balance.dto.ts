export enum TransferType {
  Taxi = 'taxi',
  Truck = 'truck',
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsInt, IsDate, IsEnum } from 'class-validator';

export class CreateBalanceDto {
  @ApiProperty({ example: 100.5, description: 'The amount of the balance' })
  @IsNumber()
  @Min(0.01) // Example validation rule: Minimum value for amount
  amount: number;

  @ApiProperty({ example: 1, description: 'The ID of the driver' })
  @IsInt()
  driver_id: number;

  @ApiProperty({
    example: '2024-07-10T08:00:00.000Z',
    description: 'The date of the balance transfer',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    enum: TransferType,
    example: TransferType.Taxi,
    description: 'The type of transfer (taxi or truck)',
  })
  @IsEnum(TransferType)
  transfer_type: TransferType;
}
