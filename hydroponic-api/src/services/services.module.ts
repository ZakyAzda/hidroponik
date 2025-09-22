import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/prisma.service'; // <-- Impor PrismaService

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService], // <-- Tambahkan PrismaService di sini
})
export class ServicesModule {}