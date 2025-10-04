import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional() // Deskripsi boleh kosong
  description?: string;

  @IsInt()
  @IsPositive() // Harga harus angka positif
  @IsNotEmpty()
  price: number;

  @IsString() // Kita hanya perlu memastikan ini adalah string
  @IsOptional() // Dan ini boleh kosong jika tidak ada gambar
  imageUrl?: string;

  @IsInt()
  @IsNotEmpty()
  stock: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}