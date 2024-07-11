import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    try {
      const createdOrderTruck = await this.prismaService.car.create({
        data: {
          ...createCarDto,
        },
      });

      return createdOrderTruck;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.prismaService.car.findMany();
  }

  findOne(id: number) {
    return this.prismaService.car.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const updatedOrderTruck = await this.prismaService.car.update({
      where: { id },
      data: {
        ...updateCarDto,
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
