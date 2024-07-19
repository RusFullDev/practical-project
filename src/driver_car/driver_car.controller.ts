import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators
import { DriverCarService } from './driver_car.service';
import { CreateDriverCarDto } from './dto/create-driver_car.dto';
import { UpdateDriverCarDto } from './dto/update-driver_car.dto';

@ApiTags('driver-car') // Group API under "Driver-Car" tag in Swagger
@Controller('driver-car')
export class DriverCarController {
  constructor(private readonly driverCarService: DriverCarService) {}

  @Post()
  @ApiOperation({ summary: 'Create Driver-Car Relation' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiBody({ type: CreateDriverCarDto }) // Specify input DTO for Swagger
  create(@Body() createDriverCarDto: CreateDriverCarDto) {
    return this.driverCarService.create(createDriverCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Driver-Car Relations' })
  @ApiResponse({ status: 200, description: 'Returns all driver-car relations' })
  findAll() {
    return this.driverCarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Driver-Car Relation By ID' })
  @ApiResponse({ status: 200, description: 'Returns a single driver-car relation' })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  findOne(@Param('id') id: string) {
    return this.driverCarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Driver-Car Relation' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  @ApiBody({ type: UpdateDriverCarDto }) // Specify input DTO for Swagger
  update(@Param('id') id: string, @Body() updateDriverCarDto: UpdateDriverCarDto) {
    return this.driverCarService.update(+id, updateDriverCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Driver-Car Relation' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  remove(@Param('id') id: string) {
    return this.driverCarService.remove(+id);
  }
}
