import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OrderTaxiModule } from './order_taxi/order_taxi.module';
import { OrderTruckModule } from './order_truck/order_truck.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,envFilePath:'.env'}),
    PrismaModule,
    UsersModule,
    OrderTaxiModule,
    OrderTruckModule,
  ],
  controllers: [],
  providers:[],

})
export class AppModule {}
