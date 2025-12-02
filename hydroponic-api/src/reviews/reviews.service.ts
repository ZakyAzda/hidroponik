  import { Injectable } from '@nestjs/common';
  import { PrismaService } from 'src/prisma.service';
  import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { ReviewStatus } from '@prisma/client';

  @Injectable()
  export class ReviewsService {
    constructor(private prisma: PrismaService) {}

    /**
     * Mengambil semua review dengan data relasi (pengguna dan produk)
     * Diurutkan dari yang terbaru
     */


    async create(userId: number, createReviewDto: CreateReviewDto) {
      return this.prisma.review.create({
        data: {
          ...createReviewDto,
          userId,
          status: ReviewStatus.APPROVED, // Review baru statusnya PENDING (perlu approval admin kalau mau)
          // Atau ganti APPROVED jika ingin langsung tampil
        },
      });
    }

    findAll() {
      return this.prisma.review.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    /**
     * Mengambil semua review yang berstatus 'APPROVED'
     */
    findAllApproved() {
      return this.prisma.review.findMany({
        where: {
          status: 'APPROVED',
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    /**
     * Memperbarui status sebuah review (PENDING, APPROVED, REJECTED)
     * @param id ID dari review yang akan diupdate
     * @param updateReviewStatusDto DTO yang berisi status baru
     */
    updateStatus(id: number, updateReviewStatusDto: UpdateReviewStatusDto) {
      return this.prisma.review.update({
        where: { id },
        data: {
          status: updateReviewStatusDto.status,
        },
      });
    }
  async findAllPublic() {
      return this.prisma.review.findMany({
        where: { status: 'APPROVED' }, // Atau tampilkan semua jika belum ada moderasi
        include: {
          user: true,    // Agar nama user muncul
          product: true, // <--- INI WAJIB ADA (Agar info produk muncul di card)
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  }
