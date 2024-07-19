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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Admin Sign Up' })
  @ApiResponse({ status: 201, description: 'Admin successfully signed up.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Admin Sign In' })
  @ApiResponse({ status: 200, description: 'Admin successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Admin Sign Out' })
  @ApiResponse({ status: 200, description: 'Admin successfully signed out.' })
  async adminSignout(
    @Body('adminId') adminId: number,
    @Res() res: Response,
  ) {
    const result = await this.adminService.adminSignout(adminId, res);
    return res.json(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiResponse({ status: 200, description: 'Admin successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Admins' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully.' })
  findAll() {
    return this.adminService.findAll();
  }

  @HttpCode(200)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Admin' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateAdminDto) {
    return this.adminService.updateDriver(+id, updateUserDto);
  }
}
