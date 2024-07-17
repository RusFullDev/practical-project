import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The phone of the user',
    example: '+998903091541',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
