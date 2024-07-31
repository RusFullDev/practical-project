import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Driver Status',
  })
  @IsNotEmpty()
  status: boolean;
}
