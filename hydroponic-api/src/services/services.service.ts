import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  // Ubah fungsi ini untuk filter berdasarkan categoryId
  findAll(categoryId?: number) {
    return this.prisma.service.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true, // Sertakan detail kategori
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: number) {
    return this.prisma.service.delete({ where: { id } });
  }
}