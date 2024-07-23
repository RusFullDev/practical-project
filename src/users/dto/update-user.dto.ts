import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'The name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'The phone number of the user' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'The password of the user' })
  @IsOptional()
  @IsString()
  password?: string;
}
