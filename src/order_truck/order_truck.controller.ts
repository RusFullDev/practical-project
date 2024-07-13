import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderTruckService } from './order_truck.service';
import { CreateOrderTruckDto } from './dto/create-order_truck.dto';
import { UpdateOrderTruckDto } from './dto/update-order_truck.dto';

@ApiTags('order-truck')
@Controller('order-truck')
export class OrderTruckController {
  constructor(private readonly orderTruckService: OrderTruckService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order truck' })
  @ApiResponse({
    status: 201,
    description: 'The order truck has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createOrderTruckDto: CreateOrderTruckDto) {
    return this.orderTruckService.create(createOrderTruckDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order trucks' })
  @ApiResponse({
    status: 200,
    description: 'Return all order trucks.',
  })
  findAll() {
    return this.orderTruckService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order truck by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order truck.',
  })
  @ApiResponse({ status: 404, description: 'Order truck not found.' })
  findOne(@Param('id') id: string) {
    return this.orderTruckService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order truck' })
  @ApiResponse({
    status: 200,
    description: 'The order truck has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order truck not found.' })
  update(
    @Param('id') id: string,
    @Body() updateOrderTruckDto: UpdateOrderTruckDto,
  ) {
    return this.orderTruckService.update(+id, updateOrderTruckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order truck' })
  @ApiResponse({
    status: 200,
    description: 'The order truck has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order truck not found.' })
  remove(@Param('id') id: string) {
    return this.orderTruckService.remove(+id);
  }
}
