import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [productCount, orderCount, bookingCount] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.serviceBooking.count(),
    ]);

    return {
      productCount,
      orderCount,
      bookingCount,
    };
  }
}