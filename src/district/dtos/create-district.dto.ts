import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateDistrictRequest } from "../interfaces";

export class CreateDistrictDto implements CreateDistrictRequest {
  @ApiProperty({
    example: 'Tashkent',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  region_id: number;
}