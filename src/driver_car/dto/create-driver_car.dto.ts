import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverCarDto {
  @ApiProperty({ example: 1, description: 'The ID of the car' })
  @IsNumber()
  readonly carId: number;

  @ApiProperty({ example: 1, description: 'The ID of the driver' })
  @IsNumber()
  readonly driverId: number;
}
