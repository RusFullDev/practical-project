import { IsNotEmpty, IsOptional, IsPhoneNumber,IsString, } from "class-validator";

export class CreateAuthDto {

  @IsOptional()
    @IsString()
    readonly name?:string

    @IsPhoneNumber('UZ')
    @IsString()
    readonly phone:string

    @IsNotEmpty()
    @IsString()
    readonly password:string


}
