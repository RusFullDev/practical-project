import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,envFilePath:'.env'}),
      TypeOrmModule.forRoot({
      type:"postgres",
      host:process.env.PG_HOST,
      port:Number(process.env.PG_PORT),
      username:process.env.PG_USER,
      password:process.env.PG_PASSWORD,
      database:process.env.PG_DB,
      entities:[
        __dirname+'dist/**/*.entity{.ts,.js}'
      ],
      synchronize:true,
      autoLoadEntities: true,
      logging:true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
