import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Delete,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverAuthDto } from './dto/login-driver';
import { AuthService } from './driver.service';
import { PhoneDriverDto } from './dto/phone-driver.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CookieGetter, GetCurrentUserId } from '../common/decorators';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UpdateDriverImage } from './dto/updateImage.dto';
import { UpdateStatusDto } from './dto/ischeck.dto';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo' }, { name: 'driver_license' }]),
  )
  @Post('signup')
  async driverSignUp(
    @Body() createDriverAuthDto: CreateDriverDto,
    @Res() res: Response,
    @UploadedFiles() files: { photo: any; driver_lisence: any },
  ) {
    const tokens = await this.authService.driverSignUp(
      {
        ...createDriverAuthDto,
        ...files,
      },
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

  @Patch('ischeck/:id')
  async updateDriver(
    @Body() updatestatus: UpdateStatusDto,
    @Param('id') id: string
  ) {
    return await this.authService.updateStatus(+id, updatestatus);

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

  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo' }, { name: 'driver_license' }]),
  )
  @Patch('image/:id')
  @ApiResponse({ status: 200, description: 'Update User successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  updateDriverPhoto(
    @Param('id') id: string,
    @UploadedFiles() files: { photo: any; driver_lisence: any },
    @Body() body: UpdateDriverImage,
  ) {
    return this.authService.updateDriverPhoto(+id, { ...files });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  async remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all drivers',
  })
  async findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns one driver',
  })
  async findById(@Param('id') id: number) {
    return this.authService.findById(id);
  }
}
