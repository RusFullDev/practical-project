import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';


@ApiTags('Statistics')
@Controller('stats')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get user statistics by month' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @Get('users-by-month')
  async getUserStatsByMonth() {
    return this.statisticsService.getUserStatsByMonth();
  }

  @ApiOperation({ summary: 'Get driver statistics by month' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @Get('drivers-by-month')
  async getDriverStatsByMonth() {
    return this.statisticsService.getDriverStatsByMonth();
  }

  @ApiOperation({ summary: 'Get taxi order statistics by month' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @Get('order-taxi-by-month')
  async getOrderTaxiStatsByMonth() {
    return this.statisticsService.getOrderTaxiStatsByMonth();
  }

  @ApiOperation({ summary: 'Get truck order statistics by month' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @Get('order-truck-by-month')
  async getOrderTruckStatsByMonth() {
    return this.statisticsService.getOrderTruckStatsByMonth();
  }
}
