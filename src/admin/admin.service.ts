import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { status: OrderStatus.COMPLETED },
    });

    const totalOrders = await this.prisma.order.count();

    const pendingOrders = await this.prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });

    const cleaningOrders = await this.prisma.order.count({
      where: { status: OrderStatus.CLEANING },
    });

    const completedOrders = await this.prisma.order.count({
      where: { status: OrderStatus.COMPLETED },
    });

    const cancelledOrders = await this.prisma.order.count({
      where: { status: OrderStatus.CANCELLED },
    });

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      pendingOrders,
      cleaningOrders,
      completedOrders,
      cancelledOrders,
    };
  }

  async getRevenuePerDay() {
  const orders = await this.prisma.order.findMany({
    where: {
      status: 'DELIVERED', // only count completed revenue
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const revenueMap: Record<string, number> = {};

  for (const order of orders) {
    const date = order.createdAt.toISOString().split('T')[0];

    if (!revenueMap[date]) {
      revenueMap[date] = 0;
    }

    revenueMap[date] += order.total;
  }

  return Object.entries(revenueMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));
  }

  async getMostPopularService() {
  const result = await this.prisma.orderItem.groupBy({
    by: ['serviceId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 1,
  });

  if (!result.length) return null;

  const service = await this.prisma.service.findUnique({
    where: { id: result[0].serviceId },
  });

  return {
    serviceName: service?.name,
    totalOrders: result[0]._sum.quantity,
  };
  }
}
