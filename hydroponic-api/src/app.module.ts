// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- Impor ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ServiceBookingsModule } from './service-bookings/service-bookings.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ArticlesModule } from './articles/articles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- Membuat ConfigModule tersedia secara global
    }),
    ProductsModule,
    ProductCategoriesModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    ServiceBookingsModule,
    OrdersModule,
    DashboardModule,
    ServiceCategoriesModule,
    ArticlesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}