import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsNumber } from "class-validator";

export class UpdateOrderTaxiDto {
  @ApiProperty()
  @IsNumber()
  userId?: number;

  @ApiProperty()
  @IsString()
  from_district?: string;

  @ApiProperty()
  @IsString()
  to_district?: string;

  @ApiProperty()
  @IsDate()
  date?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}
