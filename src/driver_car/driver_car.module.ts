import { Module } from '@nestjs/common';
import { DriverCarService } from './driver_car.service';
import { DriverCarController } from './driver_car.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports:[PrismaModule],
  controllers: [DriverCarController],
  providers: [DriverCarService,PrismaService],
})
export class DriverCarModule {}
