import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'gentra' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'white' })
  @IsString()
  color: string;

  @ApiProperty({ example: 'A777AA' })
  @IsString()
  number: string;

  @ApiProperty({ example: '/img.png' })
  @IsString()
  photo: string;

  @ApiProperty({ example: 'tex passport' })
  @IsString()
  text_passport: string;

  @ApiProperty({ example: 'yuk sigimi,10kg' })
  @IsString()
  capacity: string;
}
