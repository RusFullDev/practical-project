export enum TransferType {
  Taxi = 'taxi',
  Truck = 'truck',
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsInt, IsDate, IsEnum, IsDateString } from 'class-validator';

export class CreateBalanceDto {
  @ApiProperty({ example: 100.5, description: 'The amount of the balance' })
  @IsNumber()
  @Min(0.01) // Example validation rule: Minimum value for amount
  amount: number;

  @ApiProperty({ example: 1, description: 'The ID of the driver' })
  @IsNumber()
  driverId: number;

  @ApiProperty({
    example: '2024-07-10T08:00:00.000Z',
    description: 'The date of the balance transfer',
  })
  @IsDateString()
  date: Date;

}
