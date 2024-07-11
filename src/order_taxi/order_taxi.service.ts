import { Injectable } from '@nestjs/common';
import { CreateOrderTaxiDto } from './dto/create-order_taxi.dto';
import { UpdateOrderTaxiDto } from './dto/update-order_taxi.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderTaxiService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createOrderTaxiDto: CreateOrderTaxiDto) {
    try {
      const createOrder = await this.prismaService.orderTaxi.create({
        data: {
          ...createOrderTaxiDto,
        },
      });
      return createOrder;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.prismaService.orderTaxi.findMany();
  }

  findOne(id: number) {
    return this.prismaService.orderTaxi.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateOrderTaxiDto: UpdateOrderTaxiDto) {
    const updateOrder = await this.prismaService.orderTaxi.update({
      where: { id },
      data: {
        ...updateOrderTaxiDto,
      },
    });
    return updateOrder;
  }

  remove(id: number) {
    return this.prismaService.orderTaxi.delete({
      where: { id },
    });
  }
}
