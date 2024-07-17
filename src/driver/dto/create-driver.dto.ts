import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({ example: 'John', description: 'The first name of the driver' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the driver' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: '+998933757262',
    description: 'The phone number of the driver',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '123 Street, City',
    description: 'The address of the driver',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'photo.png', description: 'The photo of the driver' })
  @IsString()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({
    example: 'DL123456789',
    description: 'The driver license number',
  })
  @IsString()
  @IsNotEmpty()
  driver_license: string;

 
  @ApiProperty({
    example: 'hashedpassword123',
    description: 'The hashed password for authentication (optional)',
  })
  @IsOptional()
  @IsString()
  hashed_password: string;


}
