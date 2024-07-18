import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverAuthDto } from './dto/login-driver';
import { AuthService } from './driver.service';
import { PhoneDriverDto } from './dto/phone-driver.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CookieGetter, GetCurrentUserId } from '../common/decorators';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async driverSignUp(
    @Body() createDriverAuthDto: CreateDriverDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.driverSignUp(
      createDriverAuthDto,
      res,
    );
    return res.json(tokens);
  }

  @Post('signin')
  async driverSignIn(
    @Body() loginDriverAuthDto: LoginDriverAuthDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.driverSignIn(loginDriverAuthDto, res);
    return res.json(tokens);
  }

  @Post('signout')
  async driverSignout(
    @Body('driverId') driverId: number,
    @Res() res: Response,
  ) {
    const result = await this.authService.driverSignout(driverId, res);
    return res.json(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  async refreshToken(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(refreshToken, res);
  }

  @HttpCode(200)
  @Post('newOtp')
  @ApiOperation({ summary: 'Generate new OTP' })
  @ApiResponse({ status: 200, description: 'OTP generated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  newOtp(@Body() phoneUserDto: PhoneDriverDto) {
    return this.authService.newOtp(phoneUserDto);
  }

  @HttpCode(200)
  @Post('verifyOtp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @HttpCode(200)
  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 200, description: 'Update User successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateDriverDto) {
    return this.authService.updateDriver(+id, updateUserDto);
  }
}
