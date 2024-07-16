import { Injectable } from '@nestjs/common';
import { CreateOrderTaxiDto } from './dto/create-order_taxi.dto';
import { UpdateOrderTaxiDto } from './dto/update-order_taxi.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderTaxiService {
  constructor(private readonly prismaService: PrismaService) {}


async getCoordinates(
    name: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${name}&format=json&apiKey=0e7cd19cff5e4d6d9163ec21225512f3`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error('No coordinates found for the given name');
      }

      const { lat: latitude, lon: longitude } = data.results[0];
      return { latitude, longitude };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving coordinates: ${error.message}`);
    }
  }



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
