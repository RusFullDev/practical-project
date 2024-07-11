import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderTruckService } from './order_truck.service';
import { CreateOrderTruckDto } from './dto/create-order_truck.dto';
import { UpdateOrderTruckDto } from './dto/update-order_truck.dto';

@Controller('order-truck')
export class OrderTruckController {
  constructor(private readonly orderTruckService: OrderTruckService) {}

  @Post()
  create(@Body() createOrderTruckDto: CreateOrderTruckDto) {
    return this.orderTruckService.create(createOrderTruckDto);
  }

  @Get()
  findAll() {
    return this.orderTruckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTruckService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderTruckDto: UpdateOrderTruckDto) {
    return this.orderTruckService.update(+id, updateOrderTruckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderTruckService.remove(+id);
  }
}
