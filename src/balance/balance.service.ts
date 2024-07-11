import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBalanceDto: CreateBalanceDto) {
    const { driver_id } = createBalanceDto;
    const driver = await this.prismaService.driver.findUnique({
      where: { id: driver_id },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driver_id} not found`);
    }

    try {
      return await this.prismaService.balance.create({
        data: createBalanceDto,
      });
    } catch (error) {
      throw new Error(`Error creating balance: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.balance.findMany({
        include: { Driver: true },
      });
    } catch (error) {
      throw new Error(`Error finding balances: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const balance = await this.prismaService.balance.findUnique({
        where: { id },
        include: { Driver: true },
      });

      if (!balance) {
        throw new NotFoundException(`Balance with ID ${id} not found`);
      }

      return balance;
    } catch (error) {
      throw new Error(`Error finding balance with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateBalanceDto: UpdateBalanceDto) {
    const existingBalance = await this.prismaService.balance.findUnique({
      where: { id },
    });

    if (!existingBalance) {
      throw new NotFoundException(`Balance with ID ${id} not found`);
    }

    if (updateBalanceDto.driver_id) {
      const driver = await this.prismaService.driver.findUnique({
        where: { id: updateBalanceDto.driver_id },
      });
      if (!driver) {
        throw new NotFoundException(
          `Driver with ID ${updateBalanceDto.driver_id} not found`,
        );
      }
    }

    try {
      return await this.prismaService.balance.update({
        where: { id },
        data: updateBalanceDto,
      });
    } catch (error) {
      throw new Error(`Error updating balance with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    const existingBalance = await this.prismaService.balance.findUnique({
      where: { id },
    });

    if (!existingBalance) {
      throw new NotFoundException(`Balance with ID ${id} not found`);
    }

    try {
      return await this.prismaService.balance.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error deleting balance with ID ${id}: ${error.message}`);
    }
  }
}
