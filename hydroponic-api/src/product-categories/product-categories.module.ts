import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { PrismaService } from 'src/prisma.service'; 

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, PrismaService], 
})
export class ProductCategoriesModule {}