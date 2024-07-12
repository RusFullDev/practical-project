import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({
    status: 201,
    description: 'The car has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'Return all cars.' })
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiResponse({ status: 200, description: 'Return the car.' })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a car' })
  @ApiResponse({
    status: 200,
    description: 'The car has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({
    status: 200,
    description: 'The car has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
