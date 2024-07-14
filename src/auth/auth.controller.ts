import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';
import { Response } from 'express';

import { CookieGetter, GetCurrentUser, GetCurrentUserId } from '../common/decorators';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Post('signUp')
 async signUp(
  @Body() createAuthDto: CreateAuthDto,
  @Res({passthrough:true})res:Response,
 ){
  return this.authService.signUp(createAuthDto,res)
 }

@Post('signIn')
   async singin(@Body() createAuthDto: LoginAuthDto,
  @Res({passthrough:true}) res:Response){
    return this.authService.signIn(createAuthDto,res);
  }

@Post('signout')
  async logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @GetCurrentUserId() userId:number,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return this.authService.signout(+userId, res);
  }

  
 
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId:number,
    @GetCurrentUser('refreshToken') refreshToken:string,
    @Res({passthrough:true})
    res:Response){
      return this.authService.refreshToken(+userId,refreshToken,res)
    }
  
  


}
