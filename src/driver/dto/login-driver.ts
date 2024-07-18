import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDriverAuthDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
