import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The name of the admin',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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
