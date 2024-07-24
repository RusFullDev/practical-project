// src/auth/dto/create-driver.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDecimal, IsOptional } from "class-validator";

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    // required:true
  })
  photo?: any;

  @ApiProperty({
    type: "string",
    format: "binary",
    // required:true
  })
  driver_license?: any;
}
