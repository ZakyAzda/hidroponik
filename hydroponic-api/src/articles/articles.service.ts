import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // Membuat artikel baru, membutuhkan ID penulis (dari token)
  create(createArticleDto: CreateArticleDto, authorId: number) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        authorId: authorId,
      },
    });
  }

  // Menemukan semua artikel (untuk publik, hanya yang sudah publish)
  findAllPublished() {
    return this.prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true }, // Hanya ambil nama penulis
        },
      },
    });
  }

  // Menemukan semua artikel (untuk admin, semua status)
  findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
  }

  // Menemukan satu artikel berdasarkan ID
  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Artikel dengan ID ${id} tidak ditemukan.`);
    }
    return article;
  }

  // Memperbarui artikel
  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  // Menghapus artikel
  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}