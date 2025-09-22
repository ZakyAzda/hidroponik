import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto';
import { UpdateServiceBookingDto } from './dto/update-service-booking.dto';

@Injectable()
export class ServiceBookingsService {
  constructor(private prisma: PrismaService) {}

  create(createServiceBookingDto: CreateServiceBookingDto, userId: number) {
    return this.prisma.serviceBooking.create({
      data: {
        scheduledDate: new Date(createServiceBookingDto.scheduledDate),
        notes: createServiceBookingDto.notes,
        serviceId: createServiceBookingDto.serviceId,
        userId: userId,
      },
    });
  }

  findAllForUser(userId: number) {
    return this.prisma.serviceBooking.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const booking = await this.prisma.serviceBooking.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan.');
    }
    return booking;
  }


  async update(
    id: number,
    userId: number,
    updateServiceBookingDto: UpdateServiceBookingDto,
  ) {
    // Pertama, pastikan booking ini ada dan milik user yang benar
    await this.findOne(id, userId);

    return this.prisma.serviceBooking.update({
      where: {
        id: id,
      },
      data: updateServiceBookingDto,
    });
  }
}