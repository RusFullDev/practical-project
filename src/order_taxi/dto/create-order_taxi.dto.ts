import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsNumber } from "class-validator";

export class CreateOrderTaxiDto {
  @ApiProperty({
    example: 1,
    description: "The ID of the user making the order",
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: "Central District",
    description: "The district where the journey starts",
  })
  @IsString()
  from_district: string;

  @ApiProperty({
    example: "North District",
    description: "The district where the journey ends",
  })
  @IsString()
  to_district: string;

  @ApiProperty({
    example: "2024-07-11T10:30:00Z",
    description: "The date and time of the order",
  })
  @IsDate()
  date: string;

  @ApiProperty({
    example: "123 Main St, Central District",
    description: "The exact location of the pickup point",
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: "Need a ride to the airport",
    description: "Additional information or instructions for the order",
  })
  @IsString()
  description: string;
}
