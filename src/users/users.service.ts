import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import axios from "axios";
import { AddMinutesToDate } from '../common/helpers/addMinutes';
import { dates, decode, encode } from '../common/helpers/crypto'
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Otp } from "@prisma/client";
import { PhoneUserDto } from "./dto/phone-user.dto";
import { v4 } from 'uuid';
import * as otpGenerator from 'otp-generator';
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  /*********************************getToken********************************************/
  async getTokens(user: User) {
    const payload = {
      id: user.id,
      phone: user.phone,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /*************************************updateRefreshToken*****************************************************/
  async updateRefreshToken(user: User, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashed_token: hashedRefreshToken,
      },
    });
  }

  /****************************************signUp**********************************************/
  async signUp(
    createUserDto: CreateUserDto,
    res: Response
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: createUserDto.phone,
      }
    })
    if (user) {
      throw new BadRequestException("User already exists !")
    }
if(createUserDto.password != createUserDto.confirm_password){
  throw new BadRequestException("Password not match!")
}
    const hashed_password = await bcrypt.hash(createUserDto.password, 7)
    const newUser = await this.prismaService.user.create({
      data: {
        phone: createUserDto.phone,
        hashed_password,
        ...user
      }
    })

    const tokens = await this.getTokens(newUser)
    await this.updateRefreshToken(newUser, tokens.refresh_token)
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true
    })
    return tokens
  }

  /************************************************signIn********************************************************* */

  async signIn(loginUserDto: LoginUserDto, res: Response) {

    const { password, phone } = loginUserDto

    const newUser = await this.prismaService.user.findUnique({
      where: { phone }
    })
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

    const tokens = await this.getTokens(newUser)

    const updateUser = await this.updateRefreshToken(newUser, tokens.refresh_token)

    res.cookie("refresh_token", tokens.refresh_token,
      {
        maxAge: Number(process.env.COOKIE_TIME),
        httpOnly: true,
      })

    return tokens


  }
  /***************************************************logout******************************************************* */

  async signOut(userId: number, res: Response) {
    const user = await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashed_token: {
          not: null
        },
      },
      data: {
        hashed_token: null
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
      where: {
        id: userId
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

    const tokens = await this.getTokens(newUser);
    await bcrypt.hash(tokens.refresh_token, 7);

    const checkUser = await this.prismaService.user.findUnique({ where: { id: newUser.id } })
    if (!checkUser) {
      throw new BadRequestException('user not Found');
    }

    await this.updateRefreshToken(newUser, tokens.refresh_token)

    res.cookie("refresh_token", tokens.refresh_token,
      {
        maxAge: Number(process.env.COOKIE_TIME),
        httpOnly: true,
      })


    return tokens;

  }

  /*******************************NewOtp*******************************/
  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone = phoneUserDto.phone;
    const existingUser = await this.prismaService.user.findUnique({
      where: { phone: phone },
    });

    if (!existingUser) {
      const resp = await axios.post(
        "https://notify.eskiz.uz/api/message/sms/send",
        {
          mobile_phone: phone,
          message: "Bu Eskiz dan test",
          from: "4546",
          callback_url: "http://0000.uz/test.php",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SMS_TOKEN}`,
          },
        }
      );
      if (resp.status !== 200) {
        throw new ServiceUnavailableException("Otp yuborishda xatolik");
      }
      const otp = "Bu Eskiz dan test";
      const message = "Bu Eskiz dan test" + phone.slice(phone.length - 4);
      const now = new Date();
      const expiration_time = AddMinutesToDate(now, 5);
      const newOtp = await this.prismaService.otp.create({
        data: {
          otp,
          expiration_time,
          check: phone,
          verified: false

        },
      });

      const details = {
        timestamp: now,
        check: phone,
        otp_id: newOtp.id,
      };

      const encoded = encode(JSON.stringify(details));
      return { status: "Success", details: encoded, message };
    } else {
      throw new BadRequestException("User already exists");
    }
  }
  /*****************************************verifyOtp********************************************* */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, otp, check } = verifyOtpDto;
    const currentDate = new Date();
    const decoded = await decode(verification_key);
    const details = JSON.parse(decoded);

    if (details.check !== check) {
      throw new BadRequestException("OTP bu raqamga yuborilmagan");
    }

    const resultOtp = await this.prismaService.otp.findUnique({
      where: { id: details.otp_id },
    });

    if (!resultOtp) {
      throw new BadRequestException("Bunday Otp yo'q");
    }


    if (resultOtp.verified) {
      throw new BadRequestException("Bu otp allaqachon tekshirilgan");
    }


    if (currentDate > resultOtp.expiration_time) {
      throw new BadRequestException("Bu otpning vaqti tugagan");
    }

    if (otp !== resultOtp.otp) {
      throw new BadRequestException("Otp mos emas");
    }

    const user = await this.prismaService.user.update({
      where: { phone: check },
      data: { is_active: true },
    });

    if (!user) {
      throw new BadRequestException('Bunday user yo\'q');
    }

    await this.prismaService.otp.update({
      where: { id: details.otp_id },
      data: { verified: true },
    });

    const response = {
      message: "OTP successfully verified",
      user: user,
    };

    return response;
  }
}

