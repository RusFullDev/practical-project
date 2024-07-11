import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderTruckDto } from './dto/create-order_truck.dto';
import { UpdateOrderTruckDto } from './dto/update-order_truck.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderTruckService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderTruckDto: CreateOrderTruckDto) {
    try {
      if (createOrderTruckDto.userId) {
        const userExists = await this.prismaService.user.findUnique({
          where: { id: createOrderTruckDto.userId },
        });

        if (!userExists) {
          throw new BadRequestException('User does not exist');
        }
      }
      const createdOrderTruck = await this.prismaService.orderTruck.create({
        data: {
          ...createOrderTruckDto
        },
      });
      
      return createdOrderTruck;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.prismaService.orderTruck.findMany();
  }

  findOne(id: number) {
    return this.prismaService.orderTruck.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateOrderTruckDto: UpdateOrderTruckDto) {
    if (updateOrderTruckDto.userId) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updateOrderTruckDto.userId },
      });

      if (!userExists) {
        throw new BadRequestException('User does not exist');
      }
    }

    const updatedOrderTruck = await this.prismaService.orderTruck.update({
      where: { id },
      data: {
        ...updateOrderTruckDto,
      },
    });
    return updatedOrderTruck;
  }

  remove(id: number) {
    return this.prismaService.orderTruck.delete({
      where: { id },
    });
  }
}
