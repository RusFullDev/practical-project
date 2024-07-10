import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsString } from 'class-validator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsString()
  hashed_password: string;

  @ApiProperty()
  @IsString()
  hashed_token: string;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}
