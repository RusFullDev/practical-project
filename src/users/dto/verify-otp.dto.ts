import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The encoded verification key containing OTP details',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOiAiMjAyMy0wNy0xMCAwODowMDowMCIsImNoZWNrIjoicGFyYW5nZWluIiwib3RwX2lkIjoiMTIzNDU2Nzg5MDEyMyJ9.W4JHt7bLXHciPHo9gkc8VO7wD8WjITZtn8L2RjgaHLo',
  
  })
  @IsString()
  verification_key: string;

  @ApiProperty({
    description: 'The OTP code sent to the user',
    example: '123456',
   
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: 'The phone number used for OTP verification',
    example: '+998901234567'
  })
  @IsPhoneNumber('UZ')
  check: string;
}
