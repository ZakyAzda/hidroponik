// src/services/dto/create-service.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsEnum(ServiceType) // Memastikan nilainya hanya 'INSTALLATION' atau 'TRAINING'
  @IsNotEmpty()
  type: ServiceType;
}