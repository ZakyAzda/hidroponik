// Contoh file baru: services-categories.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';

@Controller('services-categories') // <-- URL ini cocok dengan permintaan frontend
export class ServicesCategoriesController {
  constructor(private readonly categoriesService: ServiceCategoriesService) {}

  @Get()
  findAll() {
    // Panggil service untuk mengambil semua data kategori dari database
    return this.categoriesService.findAll();
  }
}