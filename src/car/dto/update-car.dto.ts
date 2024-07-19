import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @ApiProperty({ example: 'gentra' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 'white' })
  @IsString()
  color?: string;

  @ApiProperty({ example: 'A777AA' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ example: 'yuk sigimi,10kg' })
  @IsOptional()
  @IsString()
  capacity?: string;
}
