import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // READ: Mengambil semua produk (dengan filter kategori opsional)
  findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId: categoryId } : {},
      // --- TAMBAHKAN BARIS INI ---
      include: {
        category: true, // <-- INI KUNCINYA! Agar nama kategori ikut terkirim
      },
      // ---------------------------
      orderBy: {
        id: 'desc' // (Opsional) Biar produk baru muncul paling atas
      }
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id: id },
    });
  }

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

   update(id: number, updateProductDto: UpdateProductDto) { 
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}