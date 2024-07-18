import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminAuthDto {
  @ApiProperty({
    description: 'The phone number of the admin',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The password for the admin account',
    example: 'securepassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
