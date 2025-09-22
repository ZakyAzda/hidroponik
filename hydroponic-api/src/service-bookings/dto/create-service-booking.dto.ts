// src/service-bookings/dto/create-service-booking.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateServiceBookingDto {
  @IsInt()
  @IsNotEmpty()
  serviceId: number;

  @IsDateString() // Memastikan format tanggal benar (ISO 8601)
  @IsNotEmpty()
  scheduledDate: string;

  @IsString()
  @IsOptional() // Notes boleh kosong
  notes?: string;
}