import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsAlphanumeric,
  IsNumber,
  MinLength,
} from 'class-validator';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'The first name of the driver',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'The last name of the driver',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    example: '+123456789',
    description: 'The phone number of the driver',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('UZ') // 'ZZ' specifies the phone number region (e.g., 'US', 'GB')
  phone?: string;

  @ApiPropertyOptional({
    example: '123 Street, City',
    description: 'The address of the driver',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'photo.png',
    description: 'The photo of the driver',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    example: 'DL123456789',
    description: 'The driver license number',
  })
  @IsOptional()
  @IsString()
  driver_license?: string;

  @ApiPropertyOptional({
    example: 'newpassword',
    description: 'The new password of the driver',
  })
  @IsOptional()
  @IsString()
  @MinLength(8) // Example validation rule: Minimum password length
  hashed_password?: string;

  @ApiPropertyOptional({
    example: 1000.0,
    description: 'The updated total balance of the driver',
  })
  @IsOptional()
  @IsNumber()
  total_balance?: number;
}
