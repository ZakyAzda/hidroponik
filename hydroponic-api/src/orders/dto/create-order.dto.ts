import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
  IsEnum, // <-- Import Baru
} from 'class-validator';

// Kita definisikan Enum manual atau import dari Prisma Client jika bisa
export enum PaymentMethodDto {
  BANK_TRANSFER = 'BANK_TRANSFER',
  GOPAY = 'GOPAY',
  OVO = 'OVO',
  COD = 'COD' // Tambahan jika ingin fitur COD
}

class OrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // --- TAMBAHAN PENTING ---
  @IsNotEmpty()
  @IsEnum(PaymentMethodDto) // Validasi input harus sesuai Enum
  paymentMethod: PaymentMethodDto; 

  @IsInt()
  @IsNotEmpty()
  addressId: number;
}