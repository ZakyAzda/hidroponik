  // src/articles/dto/create-article.dto.ts

  import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

  export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty() // <-- Pastikan ini ada
    imageUrl: string; // <-- Hapus tanda tanya (?)
  }