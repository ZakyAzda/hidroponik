import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductCategoriesService {
  constructor(private prisma: PrismaService) {}

  // CREATE: Membuat kategori baru
  create(body: { name: string }) {
    return this.prisma.productCategory.create({
      data: body,
    });
  }

  // READ: Mengambil semua kategori
  findAll() {
    return this.prisma.productCategory.findMany();
  }
}