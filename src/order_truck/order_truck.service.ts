import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderTruckDto } from './dto/create-order_truck.dto';
import { UpdateOrderTruckDto } from './dto/update-order_truck.dto';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class OrderTruckService {
  constructor(private readonly prismaService: PrismaService) {}

 async getCoordinates(
    name: string
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${name}&format=json&apiKey=0e7cd19cff5e4d6d9163ec21225512f3`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error("No coordinates found for the given name");
      }

      const { lat: latitude, lon: longitude } = data.results[0];
      return { latitude, longitude };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving coordinates: ${error.message}`);
    }
  }

  
  async create(createOrderTruckDto: CreateOrderTruckDto) {
    try {
      const { from_district, to_district } = createOrderTruckDto;
      const fromCoordinat = await this.getCoordinates(from_district);
      if (!fromCoordinat) {
        throw new NotFoundException("From region not found");
      }
      const toCoordinat = await this.getCoordinates(to_district);
      if (!toCoordinat) {
        throw new NotFoundException("To region not found");
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: `${fromCoordinat.latitude},${fromCoordinat.longitude}`,
            destinations: `${toCoordinat.latitude},${toCoordinat.longitude}`,
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );
      if (response.data.status !== "OK") {
        throw new Error("Error fetching distance data from Google Maps API");
      }
      const distance = response.data.rows[0].elements[0].distance.text;
      const duration = response.data.rows[0].elements[0].duration.text;

      const createOrder = await this.prismaService.orderTruck.create({
        data: {
          distance,
          duration,
          ...createOrderTruckDto,
        },
      });
      return createOrder;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Failed to create delivery order");
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
