import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.productCategoriesService.create(body);
  }

  @Get()
  findAll() {
    return this.productCategoriesService.findAll();
  }
}