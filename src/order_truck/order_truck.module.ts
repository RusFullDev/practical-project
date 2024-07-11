import { Module } from '@nestjs/common';
import { OrderTruckService } from './order_truck.service';
import { OrderTruckController } from './order_truck.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [OrderTruckController],
  providers: [OrderTruckService],
})
export class OrderTruckModule {}
