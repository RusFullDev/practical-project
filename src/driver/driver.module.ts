import { Module } from '@nestjs/common';
import { AuthService } from './driver.service';
import { DriverController } from './driver.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [DriverController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class DriverModule {}
