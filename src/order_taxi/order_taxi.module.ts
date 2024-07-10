import { Module } from '@nestjs/common';
import { OrderTaxiService } from './order_taxi.service';
import { OrderTaxiController } from './order_taxi.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [OrderTaxiController],
  providers: [OrderTaxiService],
})
export class OrderTaxiModule {}
