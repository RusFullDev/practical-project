import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateRegionRequest } from "../interfaces";

export class CreateRegionDto implements CreateRegionRequest {
  @ApiProperty({
    example: 'Tashkent',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}