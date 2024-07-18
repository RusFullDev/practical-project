import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminAuthDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(user: Admin) {
    try {
      const payload = {
        id: user.id,
        phone: user.phone, // Adjust based on your Admin schema
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

  async updateAdminRefreshToken(adminId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.admin.update({
      where: {
        id: adminId,
      },
      data: {
        hashed_token: hashedRefreshToken,
      },
    });
  }

  async adminSignUp(createAdminDto: CreateAdminDto, res: Response) {
    try {
      console.log(createAdminDto);

      const admin = await this.prismaService.admin.findFirst({
        where: {
          phone: createAdminDto.phone,
        },
      });
      if (admin) {
        throw new BadRequestException('Admin already exists!');
      }

      const hashed_password = await bcrypt.hash(createAdminDto.password, 7);

      const newAdmin = await this.prismaService.admin.create({
        data: {
          name: createAdminDto.name,
          phone: createAdminDto.phone,
          hashed_password,
          hashed_token: 'null',
        },
      });

      const tokens = await this.getTokens(newAdmin);
      await this.updateAdminRefreshToken(newAdmin.id, tokens.refresh_token);

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
        newAdmin,
      };
    } catch (error) {
      console.error('Error in adminSignUp:', error);
      throw new BadRequestException('Signup failed');
    }
  }
  async adminSignIn(loginAdminAuthDto: LoginAdminAuthDto, res: Response) {
    const { password, phone } = loginAdminAuthDto;
    const admin = await this.prismaService.admin.findFirst({
      where: { phone: loginAdminAuthDto.phone },
    });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const passwordIsMatch = await bcrypt.compare(
      password,
      admin.hashed_password,
    );
    if (!passwordIsMatch) {
      throw new BadRequestException('Password does not match');
    }

    const tokens = await this.getTokens(admin);
    await this.updateAdminRefreshToken(admin.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      tokens,
      admin,
    };
  }

  async adminSignout(adminId: number, res: Response) {
    const admin = await this.prismaService.admin.updateMany({
      where: {
        id: adminId,
      },
      data: {
        hashed_token: '',
      },
    });
    if (!admin) {
      throw new ForbiddenException('Access Denied');
    }

    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    return true;
  }

  findAll() {
    return this.prismaService.admin.findMany();
  }

  async updateDriver(id: number, updateUserDto: UpdateAdminDto) {
    const newUser = await this.prismaService.admin.findUnique({
      where: { id },
    });
    if (!newUser) {
      throw new BadRequestException('Admin not found');
    }
    const matchPassword = await bcrypt.compare(
      updateUserDto.password,
      newUser.hashed_password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Password not match');
    }
    const hashed_password = await bcrypt.hash(updateUserDto.password, 7);
    const updateUser = await this.prismaService.admin.update({
      where: { id },
      data: {
        hashed_password,
        ...updateUserDto,
      },
    });

    return updateUser;
  }

  remove(id: number) {
    return this.prismaService.admin.delete({
      where: { id },
    });
  }
}
