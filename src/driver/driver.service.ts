// import { Injectable } from '@nestjs/common';
// import { CreateDriverDto } from './dto/create-driver.dto';
// import { UpdateDriverDto } from './dto/update-driver.dto';
// import { PrismaService } from '../prisma/prisma.service';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverAuthDto } from './dto/login-driver';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UpdateDriverDto } from './dto/update-driver.dto';

// @Injectable()
// export class DriverService {

// constructor(private readonly prismaService: PrismaService) {}

// async create(createDriverDto: CreateDriverDto) {
//   try {
//     return await this.prismaService.driver.create({
//       data: createDriverDto,
//     });
//   } catch (error) {
//     throw new Error(`Error creating driver: ${error.message}`);
//   }
// }

// }

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getDriverTokens(driverId: number, phone: string) {
    const jwtPayload = {
      sub: driverId,
      phone: phone,
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

    const hashed_password = await bcrypt.hash(
      createDriverDto.hashed_password,
      7,
    );

    const newDriver = await this.prismaService.driver.create({
      data: {
        first_name: createDriverDto.first_name,
        last_name: createDriverDto.last_name,
        phone: createDriverDto.phone,
        address: createDriverDto.address,
        photo: createDriverDto.photo,
        driver_license: createDriverDto.driver_license,
        total_balance: createDriverDto.total_balance,
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
    res.clearCookie('access_token');
    return true;
  }

  async refreshDriverToken(
    driverId: number,
    refreshToken: string,
    res: Response,
  ) {
    const driver = await this.prismaService.driver.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!driver || !driver.hashed_token) {
      throw new BadRequestException('Driver not found');
    }

    const tokenMatch = await bcrypt.compare(refreshToken, driver.hashed_token);
    if (!tokenMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getDriverTokens(driver.id, driver.phone);
    await this.updateDriverRefreshToken(driver.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return tokens;
  }

// Default CRUD------------------------------------------------------------

  async create(createDriverDto: CreateDriverDto) {
    try {
      return await this.prismaService.driver.create({
        data: createDriverDto,
      });
    } catch (error) {
      throw new Error(`Error creating driver: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.driver.findMany();
    } catch (error) {
      throw new Error(`Error finding drivers: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.driver.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error finding driver with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    try {
      return await this.prismaService.driver.update({
        where: {
          id: id,
        },
        data: updateDriverDto,
      });
    } catch (error) {
      throw new Error(`Error updating driver with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.driver.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error deleting driver with ID ${id}: ${error.message}`);
    }
  }
}
