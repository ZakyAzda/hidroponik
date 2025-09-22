import { IsEnum, IsString } from 'class-validator';

// Mendefinisikan status yang diizinkan
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}