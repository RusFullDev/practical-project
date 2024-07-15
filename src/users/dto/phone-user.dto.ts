import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneUserDto {
  @ApiProperty({
    description: 'The phone number of the user in Uzbekistan format',
    example: '+998901234567',
  })
  @IsPhoneNumber('UZ')
  phone: string;
}
