// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static'; // <-- 1. IMPOR INI
import { join } from 'path'; // <-- 2. IMPOR INI

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
    // --- 3. TAMBAHKAN BLOK INI ---
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), 
      serveRoot: '/', // File bisa diakses langsung dari root (misal: localhost:3000/uploads/foto.jpg)
    }),
    // -----------------------------
    
    ConfigModule.forRoot({
      isGlobal: true,
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