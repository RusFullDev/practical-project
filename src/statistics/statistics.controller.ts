import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('stats')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('users-by-month')
  async getUserStatsByMonth() {
    return this.statisticsService.getUserStatsByMonth();
  }

  @Get('drivers-by-month')
  async getDriverStatsByMonth() {
    return this.statisticsService.getDriverStatsByMonth();
  }

  @Get('order-taxi-by-month')
  async getOrderTaxiStatsByMonth() {
    return this.statisticsService.getOrderTaxiStatsByMonth();
  }

  @Get('order-truck-by-month')
  async getOrderTruckStatsByMonth() {
    return this.statisticsService.getOrderTruckStatsByMonth();
  }
}
