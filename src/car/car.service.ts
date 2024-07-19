import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateCarImage } from './dto/updateImage.dto';

@Injectable()
export class CarService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: CloudinaryService,
  ) {}

  async create(createCarDto: CreateCarDto) {
    try {
      const photo = await (await this.fileService.uploadImage(createCarDto.photo[0])).url;

      const text_passport = await (await this.fileService.uploadImage(createCarDto.text_passport[0])).url;

      const createdOrderTruck = await this.prismaService.car.create({
        data: {
          model: createCarDto.model,
          color: createCarDto.capacity,
          number: createCarDto.number,
          capacity: createCarDto.capacity,
          photo: photo,
          text_passport: text_passport,
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

  async updateCarPhoto(id: number, updateaCarImage: UpdateCarImage) {
    const car = await this.prismaService.car.findUnique({
      where: { id },
    });
    if (!car) {
      throw new BadRequestException('Car not found');
    }

    if (updateaCarImage.text_passport) {
      const text_passport = await (
        await this.fileService.uploadImage(updateaCarImage.text_passport)
      ).url;
      await this.prismaService.car.update({
        where: { id: id },
        data: { text_passport: text_passport },
      });
    }

    if (updateaCarImage.photo) {
      const photo = await (
        await this.fileService.uploadImage(updateaCarImage.photo)
      ).url;
      await this.prismaService.car.update({
        where: { id: id },
        data: { photo: photo },
      });
    }
  }

  remove(id: number) {
    return this.prismaService.orderTruck.delete({
      where: { id },
    });
  }
}
