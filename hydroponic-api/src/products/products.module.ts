import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service'; // <-- Impor PrismaService

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService], // <-- Tambahkan PrismaService
})
export class ProductsModule {}