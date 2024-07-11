import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          ...createUserDto,
        },
      });
      return createdUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
    return updatedUser;
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
