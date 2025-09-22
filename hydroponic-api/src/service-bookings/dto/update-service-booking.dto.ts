// src/service-bookings/dto/update-service-booking.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceBookingDto } from './create-service-booking.dto';

export class UpdateServiceBookingDto extends PartialType(
  CreateServiceBookingDto,
) {}