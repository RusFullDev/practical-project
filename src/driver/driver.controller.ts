import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
// import { AuthService } from '../auth/auth.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverAuthDto } from './dto/login-driver';
import { AuthService } from './driver.service';

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

  @Post('refresh-token')
  async refreshDriverToken(
    @Body('driverId') driverId: number,
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshDriverToken(
      driverId,
      refreshToken,
      res,
    );
    return res.json(tokens);
  }
  // constructor(private readonly driverService: DriverService) {}

  // @ApiOperation({ summary: 'Create a new driver' })
  // @ApiBody({ type: CreateDriverDto })
  // @Post()
  // async create(@Body() createDriverDto: CreateDriverDto) {
  //   return this.driverService.create(createDriverDto);
  // }

  // @ApiOperation({ summary: 'Get all drivers' })
  // @Get()
  // async findAll() {
  //   return this.driverService.findAll();
  // }

  // @ApiOperation({ summary: 'Get a driver by ID' })
  // @ApiParam({ name: 'id', type: 'number' })
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.driverService.findOne(+id);
  // }

  // @ApiOperation({ summary: 'Update a driver by ID' })
  // @ApiParam({ name: 'id', type: 'number' })
  // @ApiBody({ type: UpdateDriverDto })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateDriverDto: UpdateDriverDto,
  // ) {
  //   return this.driverService.update(+id, updateDriverDto);
  // }

  // @ApiOperation({ summary: 'Delete a driver by ID' })
  // @ApiParam({ name: 'id', type: 'number' })
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.driverService.remove(+id);
  // }
}
