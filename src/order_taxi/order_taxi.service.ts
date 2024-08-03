import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderTaxiDto } from './dto/create-order_taxi.dto';
import { UpdateOrderTaxiDto } from './dto/update-order_taxi.dto';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { UpdateOrderStatusDto } from './dto/update-order-status';
import { log } from 'console';

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
      const { from_district, to_district } = createOrderTaxiDto;
      const fromCoordinat = await this.getCoordinates(from_district);
      if (!fromCoordinat) {
        throw new NotFoundException('From region not found');
      }
      const toCoordinat = await this.getCoordinates(to_district);
      if (!toCoordinat) {
        throw new NotFoundException('To region not found');
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: `${fromCoordinat.latitude},${fromCoordinat.longitude}`,
            destinations: `${toCoordinat.latitude},${toCoordinat.longitude}`,
            key: process.env.GOOGLE_API_KEY,
          },
        },
      );
      if (response.data.status !== 'OK') {
        throw new Error('Error fetching distance data from Google Maps API');
      }
      const distance = response.data.rows[0].elements[0].distance.text;
      const duration = response.data.rows[0].elements[0].duration.text;

      const createOrder = await this.prismaService.orderTaxi.create({
        data: {
          distance,
          duration,
          ...createOrderTaxiDto,
        },
      });
      return createOrder;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create delivery order');
    }
  }

  findAll() {
    return this.prismaService.orderTaxi.findMany({ include: { User: true,Driver:true } });
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

  async updateStatus(id: number, payload: UpdateOrderStatusDto) {
     try {
       const order = await this.prismaService.orderTaxi.findUnique({
         where: { id },
       });

       

       if (!order) {
         throw new Error(`OrderTaxi with ID ${id} not found`);
       }

       const updatedOrder = await this.prismaService.orderTaxi.update({
         where: { id: id },
         data: { status: payload.status },
       });
       

       if (payload.status === 'finished' && order.userId) {
         console.log('order taxi finished');
         const user = await this.prismaService.user.findUnique({
           where: { id: order.userId },
         });
         

         if (user && order.status !== 'finished') {
           await this.prismaService.user.update({
             where: { id: order.userId },
             data: {
               history: user.history
                 ? ``
                 : `order_truck_id:${order.id}, date:${new Date().toISOString()}`,
             },
           });
         } else {
           console.log('status already finished');
         }
       }

       return {
         message: 'Status updated successfully',
         status: payload.status,
       };
     } catch (error) {
       throw new Error(`Error updating status: ${error.message}`);
     }
  }
}
