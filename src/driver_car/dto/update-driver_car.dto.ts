import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverCarDto {
  @ApiProperty({ example: 1, description: 'The ID of the driver', required: false })
  @IsNumber()
  readonly driverId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the car', required: false })
  @IsNumber()
  readonly carId?: number;
}
