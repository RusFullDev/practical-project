import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}
  async getUserStatsByMonth() {
    const result = await this.prisma.$queryRaw<
      { month: number; user_count: bigint }[]
    >`
      SELECT
        EXTRACT(MONTH FROM "createAt") AS month,
        COUNT(*) AS user_count
      FROM "user"
      GROUP BY month
      ORDER BY month;
    `;
    return result.map((row) => ({
      month: row.month,
      user_count: Number(row.user_count),
    }));
  }

  async getDriverStatsByMonth() {
    const result = await this.prisma.$queryRaw<
      { month: number; driver_count: bigint }[]
    >`
      SELECT
        EXTRACT(MONTH FROM "createAt") AS month,
        COUNT(*) AS driver_count
      FROM "Driver"
      GROUP BY month
      ORDER BY month;
    `;
    return result.map((row) => ({
      month: row.month,
      driver_count: Number(row.driver_count),
    }));
  }

  async getOrderTaxiStatsByMonth() {
    const result = await this.prisma.$queryRaw<
      { month: number; order_taxi_count: bigint }[]
    >`
      SELECT
        EXTRACT(MONTH FROM date) AS month,
        COUNT(*) AS order_taxi_count
      FROM "OrderTaxi"
      GROUP BY month
      ORDER BY month;
    `;
    return result.map((row) => ({
      month: row.month,
      order_taxi_count: Number(row.order_taxi_count),
    }));
  }

  async getOrderTruckStatsByMonth() {
    const result = await this.prisma.$queryRaw<
      { month: number; order_truck_count: bigint }[]
    >`
      SELECT
        EXTRACT(MONTH FROM date) AS month,
        COUNT(*) AS order_truck_count
      FROM "OrderTruck"
      GROUP BY month
      ORDER BY month;
    `;
    return result.map((row) => ({
      month: row.month,
      order_truck_count: Number(row.order_truck_count),
    }));
  }
}
