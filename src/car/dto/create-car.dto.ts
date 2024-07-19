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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required:true
  })
  photo: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required:true
  })
  text_passport: any;

  @ApiProperty({ example: 'yuk sigimi,10kg' })
  @IsString()
  capacity: string;
}
