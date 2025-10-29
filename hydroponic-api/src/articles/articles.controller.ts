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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Endpoint untuk membuat artikel (Hanya Admin)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    const authorId = req.user.sub; // Mengambil ID user dari token JWT
    return this.articlesService.create(createArticleDto, authorId);
  }

  // Endpoint untuk publik (hanya melihat artikel yang sudah publish)
  @Get()
  findAllPublished() {
    return this.articlesService.findAllPublished();
  }
  
  // Endpoint untuk admin (melihat semua artikel)
  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    return this.articlesService.findAll();
  }

  // Endpoint untuk melihat detail satu artikel
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(id);
  }

  // Endpoint untuk update artikel (Hanya Admin)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  // Endpoint untuk menghapus artikel (Hanya Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}