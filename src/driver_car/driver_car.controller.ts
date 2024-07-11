import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DriverCarService } from './driver_car.service';
import { CreateDriverCarDto } from './dto/create-driver_car.dto';
import { UpdateDriverCarDto } from './dto/update-driver_car.dto';

@Controller('driver-car')
export class DriverCarController {
  constructor(private readonly driverCarService: DriverCarService) {}

  @Post()
  create(@Body() createDriverCarDto: CreateDriverCarDto) {
    return this.driverCarService.create(createDriverCarDto);
  }

  @Get()
  findAll() {
    return this.driverCarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverCarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverCarDto: UpdateDriverCarDto) {
    return this.driverCarService.update(+id, updateDriverCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverCarService.remove(+id);
  }
}
