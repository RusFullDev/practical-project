import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString,  } from 'class-validator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, enum: Role, enumName: 'Role' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
