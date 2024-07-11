import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiOperation({ summary: 'Create a new driver' })
  @ApiBody({ type: CreateDriverDto })
  @Post()
  async create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @ApiOperation({ summary: 'Get all drivers' })
  @Get()
  async findAll() {
    return this.driverService.findAll();
  }

  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a driver by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateDriverDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @ApiOperation({ summary: 'Delete a driver by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
