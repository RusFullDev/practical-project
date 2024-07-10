import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderTaxiService } from './order_taxi.service';
import { CreateOrderTaxiDto } from './dto/create-order_taxi.dto';
import { UpdateOrderTaxiDto } from './dto/update-order_taxi.dto';

@Controller('order-taxi')
export class OrderTaxiController {
  constructor(private readonly orderTaxiService: OrderTaxiService) {}

  @Post()
  create(@Body() createOrderTaxiDto: CreateOrderTaxiDto) {
    return this.orderTaxiService.create(createOrderTaxiDto);
  }

  @Get()
  findAll() {
    return this.orderTaxiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTaxiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderTaxiDto: UpdateOrderTaxiDto) {
    return this.orderTaxiService.update(+id, updateOrderTaxiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderTaxiService.remove(+id);
  }
}
