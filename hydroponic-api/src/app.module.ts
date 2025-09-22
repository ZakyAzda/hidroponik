// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service'; // <-- Impor PrismaService
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ServiceBookingsModule } from './service-bookings/service-bookings.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ProductsModule, ProductCategoriesModule, AuthModule, UsersModule, ServicesModule, ServiceBookingsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // <-- Tambahkan PrismaService
  exports: [PrismaService], // <-- Ekspor agar bisa dipakai modul lain
})
export class AppModule {}