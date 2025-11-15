import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; // <-- DITAMBAHKAN
import { extname } from 'path'; // <-- DITAMBAHKAN
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // =======================================================
  // == 1. ENDPOINT KHUSUS ADMIN (BUTUH ROLE GUARD) ==
  // =======================================================

  // Endpoint untuk membuat artikel (Hanya Admin)
  @Post()
  @UseGuards(AuthGuard, RolesGuard) // <-- DIPERBAIKI: Tambahkan guard
  @Roles(UserRole.ADMIN) // <-- DIPERBAIKI: Hanya untuk ADMIN
  create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    console.log('DIAGNOSIS ISI req.user:', req.user);
    const authorId = req.user.userId;
    return this.articlesService.create(createArticleDto, authorId);
  }

  // Endpoint untuk admin (melihat semua artikel, termasuk draf)
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard) // <-- DIPERBAIKI: Tambahkan RolesGuard
  @Roles(UserRole.ADMIN) // <-- DIPERBAIKI: Hanya untuk ADMIN
  findAll() {
    return this.articlesService.findAll();
  }

  // Endpoint untuk upload gambar (Hanya Admin)
  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    // --- DIPERBAIKI: Salin konfigurasi dari ProductsController ---
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads', // Pastikan folder ini ada
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // --- DIPERBAIKI: Kembalikan URL lengkap ---
    return {
      imageUrl: `http://localhost:3000/uploads/${file.filename}`,
    };
  }

  // Endpoint untuk update artikel (Hanya Admin)
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  // Endpoint untuk menghapus artikel (Hanya Admin)
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }

  // =======================================================
  // == 2. ENDPOINT PUBLIK (TIDAK BUTUH GUARD) ==
  // =======================================================

  // Endpoint untuk publik (hanya melihat artikel yang sudah publish)
  @Get()
  // <-- DIPERBAIKI: Semua guard DIHAPUS agar bisa diakses publik
  findAllPublished() {
    return this.articlesService.findAllPublished();
  }

  // Endpoint untuk melihat detail satu artikel (publik)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Catatan: Service `findOne` idealnya juga harus mengecek `isPublished`
    // atau Anda perlu endpoint terpisah, misal /admin/articles/:id
    return this.articlesService.findOne(id);
  }
}