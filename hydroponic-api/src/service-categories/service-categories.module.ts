import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { ServicesCategoriesController } from './service-categories.controller';
import { PrismaService } from 'src/prisma.service'; // <-- 1. Impor PrismaService

@Module({
  controllers: [ServicesCategoriesController],
  providers: [ServiceCategoriesService, PrismaService], // <-- 2. Tambahkan PrismaService di sini
})
export class ServiceCategoriesModule {}