import {  IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {

    @IsEmail()
    readonly phone:string

    @IsNotEmpty()
    @IsString()
    readonly password:string
}
