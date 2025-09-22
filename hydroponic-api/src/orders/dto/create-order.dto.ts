import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

// Ini adalah aturan untuk setiap objek di dalam array "items"
class OrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive() // Jumlah tidak boleh 0 atau negatif
  @IsNotEmpty()
  quantity: number;
}

// Ini adalah aturan untuk body utama
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // Memberitahu validator untuk memeriksa setiap objek di dalam array ini
  @Type(() => OrderItemDto) // Menentukan tipe dari setiap objek di dalam array
  items: OrderItemDto[];
}