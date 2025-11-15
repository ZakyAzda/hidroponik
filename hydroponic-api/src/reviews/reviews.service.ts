import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Mengambil semua review dengan data relasi (pengguna dan produk)
   * Diurutkan dari yang terbaru
   */
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
}
