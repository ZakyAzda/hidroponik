// Contoh file baru: services-categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'; // Pastikan path ini benar

@Injectable()
export class ServiceCategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    // Ganti 'serviceCategory' dengan nama model Prisma Anda yang sebenarnya
    return this.prisma.serviceCategory.findMany();
  }
}