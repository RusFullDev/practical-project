import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DriverModule } from './driver/driver.module';
import { BalanceModule } from './balance/balance.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,envFilePath:'.env'}),
    PrismaModule,
    DriverModule,
    BalanceModule,
  ],
  controllers: [],
  providers:[],

})
export class AppModule {}
