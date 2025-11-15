import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Selada Hidroponik' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A brief description of the product', example: 'Selada segar bebas pestisida.', required: false })
  @IsString()
  @IsOptional() // Deskripsi boleh kosong
  description?: string;

  @ApiProperty({ description: 'The price of the product per unit', example: 15000 })
  @IsInt()
  @IsPositive() // Harga harus angka positif
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'URL of the product image', example: 'http://example.com/image.png', required: false })
  @IsString() // Kita hanya perlu memastikan ini adalah string
  @IsOptional() // Dan ini boleh kosong jika tidak ada gambar
  imageUrl?: string;

  @ApiProperty({ description: 'Available stock quantity', example: 100 })
  @IsInt()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ description: 'The ID of the category this product belongs to', example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}