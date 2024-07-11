import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    try {
      return await this.prismaService.driver.create({
        data: createDriverDto,
      });
    } catch (error) {
      throw new Error(`Error creating driver: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.driver.findMany();
    } catch (error) {
      throw new Error(`Error finding drivers: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.driver.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error finding driver with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    try {
      return await this.prismaService.driver.update({
        where: {
          id: id,
        },
        data: updateDriverDto,
      });
    } catch (error) {
      throw new Error(`Error updating driver with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.driver.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(`Error deleting driver with ID ${id}: ${error.message}`);
    }
  }
}
