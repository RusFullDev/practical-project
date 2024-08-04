import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsDateString } from 'class-validator';

export class CreateOrderTaxiDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user making the order',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'tashkent',
    description: 'The district where the journey starts',
  })
  @IsString()
  from_district: string;

  @ApiProperty({
    example: 'jizzax',
    description: 'The district where the journey ends',
  })
  @IsString()
  to_district: string;

  @ApiProperty({ example: '2024-08-03T05:49:03Z' })
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: 'Need a ride to the airport',
    description: 'Additional information or instructions for the order',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'lat,lang' })
  @IsString()
  location: string;
}
