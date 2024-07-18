// src/auth/dto/create-driver.dto.ts
import { IsString, IsNotEmpty, IsDecimal, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsString()
  @IsNotEmpty()
  driver_license: string;

  // @IsDecimal()
  // @IsNotEmpty()
  // total_balance: string; // Decimal is treated as string in DTO


}
