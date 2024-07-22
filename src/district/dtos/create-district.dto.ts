import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateDistrictRequest } from "../interfaces";

export class CreateDistrictDto implements CreateDistrictRequest {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  name: number;

  @ApiProperty({
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  region_id: number;
}