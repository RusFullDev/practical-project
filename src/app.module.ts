import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OrderTaxiModule } from './order_taxi/order_taxi.module';
import { OrderTruckModule } from './order_truck/order_truck.module';
import { CarModule } from './car/car.module';
import { DriverModule } from './driver/driver.module';
import { BalanceModule } from './balance/balance.module';
import { DistrictModule } from './district/district.module';
import { RegionModule } from './region/region.module';
import { TranslateModule } from './translate/translate.module';
import { LanguageModule } from './language/language.module';
import { AdminModule } from './admin/admin.module';




@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,envFilePath:'.env'}),
    PrismaModule,
    UsersModule,
    OrderTaxiModule,
    OrderTruckModule,
    CarModule,
    DriverModule,
    BalanceModule,
    DistrictModule,
    RegionModule,
    TranslateModule,
    LanguageModule,
    AdminModule,
  ],
  controllers: [],
  providers:[],

})
export class AppModule {}
