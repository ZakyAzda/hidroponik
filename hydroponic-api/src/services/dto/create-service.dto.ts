import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// Hapus 'ServiceType' dari impor prisma

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  // Hapus 'type' dan ganti dengan 'categoryId'
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}