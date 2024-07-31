import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { AddMinutesToDate } from '../common/helpers/addMinutes';
import { dates, decode, encode } from '../common/helpers/crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Otp } from '@prisma/client';
import { PhoneUserDto } from './dto/phone-user.dto';
import { v4 } from 'uuid';
import * as otpGenerator from 'otp-generator';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: CloudinaryService,
    private readonly jwtService: JwtService,
  ) {}

  /*********************************getToken********************************************/
  async getTokens(user: User) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  /*************************************updateRefreshToken*****************************************************/
  async updateRefreshToken(user: User, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashed_token: hashedRefreshToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /****************************************signUp**********************************************/
  async signUp(createUserDto: CreateUserDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: createUserDto.phone,
      },
    });
    if (user) {
      throw new BadRequestException('User already exists !');
    }
    if (createUserDto.password != createUserDto.confirm_password) {
      throw new BadRequestException('Password not match!');
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.prismaService.user.create({
      data: {
        phone: createUserDto.phone,
        hashed_password: hashed_password,
        name: createUserDto.name,
        hashed_token: '1',
      },
    });

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return tokens;

    try {
    } catch (error) {
      console.log(error);
    }
  }

  /************************************************signIn********************************************************* */

  async signIn(loginUserDto: LoginUserDto, res: Response) {
    const { password, phone } = loginUserDto;

    const newUser = await this.prismaService.user.findUnique({
      where: { phone },
    });
    if (!newUser) {
      throw new BadRequestException('User not found');
    }

    const passwordIsMatch = await bcrypt.compare(
      password,
      newUser.hashed_password,
    );

    if (!passwordIsMatch) {
      throw new BadRequestException('Password do not match');
    }

    const tokens = await this.getTokens(newUser);

    const updateUser = await this.updateRefreshToken(
      newUser,

      tokens.refresh_token,
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return { tokens, newUser };
  }
  /***************************************************logout******************************************************* */

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('Refresh token is invalid');
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        id: userData.id,
      },
      data: {
        hashed_token: '',
      },
    });
    res.clearCookie('refresh_token');
    return true;
  }

  /****************************************refreshToken*********************************************** */

  async refreshToken(refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    const newUser = await this.prismaService.user.findUnique({
      where: { id: decodedToken['id'] },
    });
    if (!newUser) {
      throw new BadRequestException('Refresh token is invalid');
    }

    if (!newUser || !newUser.hashed_token) {
      throw new BadRequestException('user does not exist');
    }
    const tokenMatch = await bcrypt.compare(refreshToken, newUser.hashed_token);

    if (!tokenMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(newUser);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.prismaService.user.update({
      where: { id: newUser.id },
      data: {
        hashed_token: hashed_refresh_token,
      },
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  /*******************************NewOtp*******************************/
  async newOtp(phoneUserDto: PhoneUserDto) {
    try {
      const phone = phoneUserDto.phone;
      const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const existingUser = await this.prismaService.user.findUnique({
        where: { phone: phone },
      });

      if (!existingUser) {
        const resp = await axios.post(
          'https://notify.eskiz.uz/api/message/sms/send',
          {
            mobile_phone: phone,
            message: 'Bu Eskiz dan test',
            from: '4546',
            callback_url: 'http://0000.uz/test.php',
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SMS_TOKEN}`,
            },
          },
        );
        if (resp.status !== 200) {
          throw new ServiceUnavailableException('Otp yuborishda xatolik');
        }

        const message = 'Code has been to ****' + phone.slice(phone.length - 4);
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 5);
        const newOtp = await this.prismaService.otp.create({
          data: {
            otp,
            expiration_time,
            check: phone,
            verified: false,
          },
        });

        const details = {
          timestamp: now,
          check: phone,
          otp_id: newOtp.id,
        };

        const encoded = await encode(JSON.stringify(details));
        console.log(encoded);

        return { status: 'Success', details: encoded };
      } else {
        throw new BadRequestException('User already exists');
      }
    } catch (error) {
      console.log(error);
    }
  }
  /*****************************************verifyOtp********************************************* */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { verification_key, otp, check } = verifyOtpDto;
      const currentDate = new Date();
      const decoded = await decode(verification_key);
      // console.log(decoded);

      const details = JSON.parse(decoded);
      // console.log(details);

      if (details.check !== check) {
        throw new BadRequestException('OTP bu raqamga yuborilmagan');
      }

      const resultOtp = await this.prismaService.otp.findUnique({
        where: { id: details.otp_id },
      });

      if (!resultOtp) {
        throw new BadRequestException("Bunday Otp yo'q");
      }

      if (resultOtp.verified) {
        throw new BadRequestException('Bu otp allaqachon tekshirilgan');
      }

      if (currentDate > resultOtp.expiration_time) {
        throw new BadRequestException('Bu otpning vaqti tugagan');
      }

      if (otp !== resultOtp.otp) {
        throw new BadRequestException('Otp mos emas');
      }

      await this.prismaService.otp.update({
        where: { id: details.otp_id },
        data: { verified: true },
      });

      const user = await this.prismaService.user.update({
        where: { phone: check },
        data: { is_active: true },
      });

      if (!user) {
        throw new BadRequestException("Bunday user yo'q");
      }

      const response = {
        message: 'OTP successfully verified',
        user: user,
      };

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /******************************************updateUser******************************** */
  // async updateUser(id: number, updateUserDto: UpdateUserDto) {
  //   try {

  //     const newUser = await this.prismaService.user.findUnique({
  //       where: { id },
  //     });
  //     if (!newUser) {
  //       throw new BadRequestException("User not found");
  //     }
  //     const matchPassword = await bcrypt.compare(
  //       updateUserDto.password,
  //       newUser.hashed_password
  //     );
  //     if (!matchPassword) {
  //       throw new BadRequestException("Password not match");
  //     }
  //     const hashed_password = await bcrypt.hash(updateUserDto.password, 7);

  //     const updateUser = await this.prismaService.user.update({
  //       where: { id },
  //       data: {
  //         hashed_password,
  //         ...updateUserDto,
  //       },
  //     });
  //     return updateUser;
  //   } catch (error) {
  //     console.log("error", error);
  //      throw new BadRequestException("Password not match");
  //   }
  // }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      let hashedPassword = await bcrypt.hash(updateUserDto.password, 7);

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          phone: updateUserDto.phone,
          hashed_password: hashedPassword,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Failed to update user');
    }
  }

  /*****************************findAll********************************************************/
  async findAll() {
    try {
      return await this.prismaService.user.findMany({
        include: { OrderTaxi: true },
      });
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }
  /********************************************************FinOne*********************************** */
  async findOne(id: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error finding user with ID ${id}: ${error.message}`);
    }
  }

  /************************************************Delete************************************ */
  async remove(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
    }
  }
}
