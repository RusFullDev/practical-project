import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from './enums';

export class UpdateOrderTruckStatusDto {
  @ApiProperty({
    examples: ['new', 'onroad', 'waiting', 'finished'],
    enum: OrderStatus,
    required: true,
  })
  @IsEnum(OrderStatus)
  @IsString()
  status: OrderStatus;
}
