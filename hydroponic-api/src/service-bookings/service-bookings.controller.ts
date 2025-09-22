// src/service-bookings/service-bookings.controller.ts
import { Controller, Post,Patch, Get, Body, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { ServiceBookingsService } from './service-bookings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto';
import { UpdateServiceBookingDto } from './dto/update-service-booking.dto';


@Controller('service-bookings')
export class ServiceBookingsController {
  constructor(
    private readonly serviceBookingsService: ServiceBookingsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createServiceBookingDto: CreateServiceBookingDto, @Req() req) {
    const userId = req.user.sub;
    return this.serviceBookingsService.create(createServiceBookingDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.serviceBookingsService.findOne(id, userId);
  }
  @UseGuards(AuthGuard) // Endpoint ini juga harus diproteksi
  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub; // Ambil ID user dari token
    return this.serviceBookingsService.findAllForUser(userId);
  }
    @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateServiceBookingDto: UpdateServiceBookingDto,
  ) {
    const userId = req.user.sub;
    return this.serviceBookingsService.update(id, userId, updateServiceBookingDto);
  }
}