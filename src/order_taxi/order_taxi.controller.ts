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
import { OrderTaxiService } from './order_taxi.service';
import { CreateOrderTaxiDto } from './dto/create-order_taxi.dto';
import { UpdateOrderTaxiDto } from './dto/update-order_taxi.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status';

@ApiTags('order-taxi')
@Controller('order-taxi')
export class OrderTaxiController {
  constructor(private readonly orderTaxiService: OrderTaxiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order taxi' })
  @ApiResponse({
    status: 201,
    description: 'The order taxi has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createOrderTaxiDto: CreateOrderTaxiDto) {
    return this.orderTaxiService.create(createOrderTaxiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order taxis' })
  @ApiResponse({
    status: 200,
    description: 'Return all order taxis.',
  })
  findAll() {
    return this.orderTaxiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order taxi by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order taxi.',
  })
  @ApiResponse({ status: 404, description: 'Order taxi not found.' })
  findOne(@Param('id') id: string) {
    return this.orderTaxiService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order taxi' })
  @ApiResponse({
    status: 200,
    description: 'The order taxi has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order taxi not found.' })
  update(
    @Param('id') id: string,
    @Body() updateOrderTaxiDto: UpdateOrderTaxiDto,
  ) {
    return this.orderTaxiService.update(+id, updateOrderTaxiDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order taxi' })
  @ApiResponse({
    status: 200,
    description: 'The order taxi has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order taxi not found.' })
  remove(@Param('id') id: string) {
    return this.orderTaxiService.remove(+id);
  }

  @Patch('update-status/:id')
  async updateDriver(
    @Body() updatestatus: UpdateOrderStatusDto,
    @Param('id') id: string,
  ) {
    return await this.orderTaxiService.updateStatus(+id, updatestatus);
  }
}
