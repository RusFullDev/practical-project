import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports:[PrismaModule],
  controllers: [CarController],
  providers: [CarService, CloudinaryService],
})
export class CarModule {}
