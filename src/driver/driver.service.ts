import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverAuthDto } from './dto/login-driver';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PhoneDriverDto } from './dto/phone-driver.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as otpGenerator from 'otp-generator';
import { AddMinutesToDate } from '../common/helpers/addMinutes';
import { decode, encode } from '../common/helpers/crypto';
import axios from 'axios';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateDriverImage } from './dto/updateImage.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly fileService: CloudinaryService,
  ) {}

  // async getTokens(user: Driver) {
  //   try {
  //     const payload = {
  //       id: user.id,
  //       phone: user.phone,
  //     };

  //     const [accessToken, refreshToken] = await Promise.all([
  //       this.jwtService.signAsync(payload, {
  //         secret: process.env.ACCESS_TOKEN_KEY,
  //         expiresIn: process.env.ACCESS_TOKEN_TIME,
  //       }),
  //       this.jwtService.signAsync(payload, {
  //         secret: process.env.REFRESH_TOKEN_KEY,
  //         expiresIn: process.env.REFRESH_TOKEN_TIME,
  //       }),
  //     ]);
  //     return {
  //       access_token: accessToken,
  //       refresh_token: refreshToken,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async getDriverTokens(driverId: number, phone: string) {
  //   const jwtPayload = {
  //     sub: driverId,
  //     phone: phone,
  //   };

  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(jwtPayload, {
  //       secret: process.env.ACCESS_TOKEN_KEY,
  //       expiresIn: process.env.ACCESS_TOKEN_TIME,
  //     }),
  //     this.jwtService.signAsync(jwtPayload, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //       expiresIn: process.env.REFRESH_TOKEN_TIME,
  //     }),
  //   ]);
  //   return {
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //   };
  // }

  async getTokens(user: any) {
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
      console.error('Error generating tokens:', error);
      throw new ServiceUnavailableException('Token generation failed');
    }
  }

  async getDriverTokens(driverId: number, phone: string) {
    const jwtPayload = {
      sub: driverId,
      phone: phone,
    };

    try {
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
    } catch (error) {
      console.error('Error generating driver tokens:', error);
      throw new ServiceUnavailableException('Driver token generation failed');
    }
  }

  async updateDriverRefreshToken(driverId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.driver.update({
      where: {
        id: driverId,
      },
      data: {
        hashed_token: hashedRefreshToken,
      },
    });
  }

  async driverSignUp(createDriverDto: CreateDriverDto, res: Response) {
    const driver = await this.prismaService.driver.findFirst({
      where: {
        phone: createDriverDto.phone,
      },
    });
    if (driver) {
      throw new BadRequestException('Driver already exists!');
    }

    const hashed_password = await bcrypt.hash(createDriverDto.password, 7);

    const photo = await (
      await this.fileService.uploadImage(createDriverDto.photo[0])
    ).url;
    const driver_license = await (
      await this.fileService.uploadImage(createDriverDto.driver_license[0])
    ).url;

    const newDriver = await this.prismaService.driver.create({
      data: {
        first_name: createDriverDto.first_name,
        last_name: createDriverDto.last_name,
        phone: createDriverDto.phone,
        address: createDriverDto.address,
        photo: photo,
        driver_license: driver_license,
        total_balance: 0,
        hashed_password,
      },
    });

    const tokens = await this.getDriverTokens(newDriver.id, newDriver.phone);
    await this.updateDriverRefreshToken(newDriver.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    res.cookie('access_token', tokens.access_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      tokens,
      newDriver,
    };
  }

  async driverSignIn(loginDriverAuthDto: LoginDriverAuthDto, res: Response) {
    const { password, phone } = loginDriverAuthDto;
    const driver = await this.prismaService.driver.findFirst({
      where: { phone: loginDriverAuthDto.phone },
    });
    if (!driver) {
      throw new BadRequestException('Driver not found');
    }

    const passwordIsMatch = await bcrypt.compare(
      password,
      driver.hashed_password,
    );
    if (!passwordIsMatch) {
      throw new BadRequestException('Password does not match');
    }

    const tokens = await this.getDriverTokens(driver.id, driver.phone);
    await this.updateDriverRefreshToken(driver.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      tokens,
      driver,
    };
  }

  async driverSignout(driverId: number, res: Response) {
    const driver = await this.prismaService.driver.updateMany({
      where: {
        id: driverId,
        hashed_token: {
          not: null,
        },
      },
      data: {
        hashed_token: null,
      },
    });
    if (!driver) {
      throw new ForbiddenException('Access Denied');
    }

    res.clearCookie('refresh_token');
    return true;
  }

  async refreshToken(refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    const newUser = await this.prismaService.driver.findUnique({
      where: { id: decodedToken['sub'] },
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
    const updatedUser = await this.prismaService.driver.update({
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

  // ==================== OTP section =================

  async newOtp(phoneUserDto: PhoneDriverDto) {
    const phone = phoneUserDto.phone;
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const existingUser = await this.prismaService.driver.findUnique({
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
      // const otp = "Bu Eskiz dan test";
      const message = 'Bu Eskiz dan test' + phone.slice(phone.length - 4);
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
      return { status: 'Success', details: encoded, message };
    } else {
      throw new BadRequestException('Driver already exists');
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, otp, check } = verifyOtpDto;
    const currentDate = new Date();
    const decoded = await decode(verification_key);
    const details = JSON.parse(decoded);

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

    const user = await this.prismaService.driver.update({
      where: { phone: check },
      data: { is_active: true },
    });

    if (!user) {
      throw new BadRequestException("Bunday user yo'q");
    }

    await this.prismaService.otp.update({
      where: { id: details.otp_id },
      data: { verified: true },
    });

    const response = {
      message: 'OTP successfully verified',
      user: user,
    };

    return response;
  }

  // ==================== OTP section =================

  // Default CRUD------------------------------------------------------------

  async updateDriver(id: number, updateUserDto: UpdateDriverDto) {
    const newUser = await this.prismaService.driver.findUnique({
      where: { id },
    });
    if (!newUser) {
      throw new BadRequestException('Driver not found');
    }
    const matchPassword = await bcrypt.compare(
      updateUserDto.password,
      newUser.hashed_password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Password not match');
    }
    const hashed_password = await bcrypt.hash(updateUserDto.password, 7);
    const updateUser = await this.prismaService.driver.update({
      where: { id },
      data: {
        hashed_password,
        ...updateUserDto,
      },
    });

    return updateUser;
  }

  async updateDriverPhoto(id: number, updateDriverImage: UpdateDriverImage) {
    const newUser = await this.prismaService.driver.findUnique({
      where: { id },
    });
    if (!newUser) {
      throw new BadRequestException('Driver not found');
    }

    if (updateDriverImage.driver_license) {
      const driver_license = await (
        await this.fileService.uploadImage(updateDriverImage.driver_license)
      ).url;
      await this.prismaService.driver.update({
        where: { id: id },
        data: { driver_license: driver_license },
      });
    }

    if (updateDriverImage.photo) {
      const photo = await (
        await this.fileService.uploadImage(updateDriverImage.photo)
      ).url;
      await this.prismaService.driver.update({
        where: { id: id },
        data: { photo: photo },
      });
    }
  }

  async findAll() {
    try {
      return await this.prismaService.driver.findMany({
        include: { driver_car:{include:{car:true, driver:true}}},
      });
    } catch (error) {
      throw new Error(`Error finding driver: ${error.message}`);
    }
  }
  async remove(id: number) {
    const existingBalance = await this.prismaService.driver.findUnique({
      where: { id },
    });

    if (!existingBalance) {
      throw new NotFoundException(`driver with ID ${id} not found`);
    }

    try {
      return await this.prismaService.driver.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error deleting driver with ID ${id}: ${error.message}`);
    }
  }
}
