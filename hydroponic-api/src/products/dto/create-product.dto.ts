import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

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

  @IsInt()
  @IsNotEmpty()
  stock: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}