import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDriverCarDto } from './dto/create-driver_car.dto';
import { UpdateDriverCarDto } from './dto/update-driver_car.dto';



@Injectable()
export class DriverCarService {
  constructor(private readonly prismaService:PrismaService){}
  create(createDriverCarDto: CreateDriverCarDto) {
    return this.prismaService.driver_car.create({data:createDriverCarDto});
  }

  findAll() {
    return this.prismaService.driver_car.findMany({include:{car:true, driver:true}})
  }

  findOne(id: number) {
    return this.prismaService.driver_car.findUnique({where:{id}})
  }

  update(id: number, updateDriverCarDto: UpdateDriverCarDto) {
    return this.prismaService.driver_car.update({where:{id},data:updateDriverCarDto})
  }

  remove(id: number) {
    return this.prismaService.driver_car.delete({where:{id}})
  }
}
