import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginAuthDto} from './dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService:PrismaService,
    private readonly jwtService:JwtService,
  ){}

  async getTokens(userId:number,phone:string) {
  const jwtPayload = {
   sub:userId,
    phone: phone
  };

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    this.jwtService.signAsync(jwtPayload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}


async updateRefreshToken(userId:number,refreshToken:string){
  const hashedRefreshToken = await bcrypt.hash(refreshToken,7)
  await this.prismaService.user.update({
    where:{
      id:userId
    },
    data:{
      hashed_token:hashedRefreshToken,
    }
  })
}

async signUp(
  createAuthDto:CreateAuthDto,
  res:Response
){
  const user = await this.prismaService.user.findFirst({
    where:{
      phone:createAuthDto.phone,
    }
  })
  if(user){
    throw new BadRequestException("User already exists !")
  }

  const hashed_password = await bcrypt.hash(createAuthDto.password,7)
  const newUser = await this.prismaService.user.create({
    data:{
      phone:createAuthDto.phone,
      hashed_password,
      ...user
    }
  })

  const tokens = await this.getTokens(newUser.id,newUser.phone)
  await this.updateRefreshToken(newUser.id,tokens.refresh_token)
  res.cookie('refresh_token',tokens.refresh_token,{
    maxAge:Number(process.env.COOKIE_TIME),
    httpOnly:true
  })
  return tokens
}

/************************************************signIn********************************************************* */

async signIn(loginAuthDto:LoginAuthDto,res:Response){
 
  const{password,phone}= loginAuthDto 
  const newUser = await this.prismaService.user.findFirst({
    where: {phone:loginAuthDto.phone}
  }  )
  if (!newUser) {
    throw new BadRequestException('User not found');
  }

  const passwordIsMatch = await bcrypt.compare(
        password,
        newUser.hashed_password
      );

  if (!passwordIsMatch) {
    throw new BadRequestException('Password do not match');
  }

  const tokens = await this.getTokens(newUser.id,newUser.phone)

const updateUser = await this.updateRefreshToken(newUser.id,tokens.refresh_token)

res.cookie("refresh_token",tokens.refresh_token,
{
  maxAge: Number(process.env.COOKIE_TIME),
   httpOnly: true,
})

return tokens


}
/***************************************************logout******************************************************* */

async signout(userId:number, res: Response) {
 const user = await this.prismaService.user.updateMany({
  where:{
    id:userId,
   hashed_token:{
      not:null
    },
  },
  data:{
    hashed_token:null
  }
 })
  if (!user) {
    throw new ForbiddenException('Access Denied');
  }
 
  res.clearCookie('refresh_token');

  return true
}
/****************************************refreshToken*********************************************** */

async refreshToken(userId: number, refreshToken: string, res: Response) {
  const user = await this.prismaService.user.findUnique({
    where:{
      id:userId
    }
  })

  if (!user || !user.hashed_token) {
    throw new BadRequestException('server not found');
  }
 
  
  const newUser = await this.prismaService.user.findUnique({ where: { id: userId } });

  if (!newUser || !newUser.hashed_token) {
    throw new BadRequestException('User not found');
  }
  const tokenMatch = await bcrypt.compare(
    refreshToken,
    newUser.hashed_token
  );

  if (!tokenMatch) {
    throw new ForbiddenException('Forbidden');
  }

  const tokens = await this.getTokens(newUser.id,newUser.phone);
  await bcrypt.hash(tokens.refresh_token, 7);

  const checkUser = await this.prismaService.user.findUnique({where:{id:newUser.id}})
  if(!checkUser){
    throw new BadRequestException('user not Found');
  }

 await this.updateRefreshToken(newUser.id,tokens.refresh_token)

  res.cookie("refresh_token",tokens.refresh_token,
  {
    maxAge: Number(process.env.COOKIE_TIME),
     httpOnly: true,
  })

 
  return tokens;
}














}
