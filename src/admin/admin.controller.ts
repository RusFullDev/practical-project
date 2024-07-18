import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Res,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Response, Request } from 'express';
import { LoginAdminAuthDto } from './dto/login-admin.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  async adminSignUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.adminSignUp(createAdminDto, res);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  async adminSignIn(
    @Body() loginAdminAuthDto: LoginAdminAuthDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.adminSignIn(
        loginAdminAuthDto,
        res,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('signout')
  async driverSignout(
    @Body('adminId') adminId: number,
    @Res() res: Response,
  ) {
    const result = await this.adminService.adminSignout(adminId, res);
    return res.json(result);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @HttpCode(200)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Admin' })
  @ApiResponse({ status: 200, description: 'Update admin successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateAdminDto) {
    return this.adminService.updateDriver(+id, updateUserDto);
  }
}
