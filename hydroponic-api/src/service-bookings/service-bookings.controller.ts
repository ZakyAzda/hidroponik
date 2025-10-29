import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ServiceBookingsService } from './service-bookings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto';
import { UpdateServiceBookingDto } from './dto/update-service-booking.dto';
// Kita tidak lagi mengimpor ServiceType di sini

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
  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub;
    return this.serviceBookingsService.findAllForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.serviceBookingsService.findOne(id, userId);
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

  // --- FUNGSI YANG DIPERBARUI ---
  @Get('admin/all')
  @UseGuards(AuthGuard)
  findAllForAdmin(@Query('category') categoryName?: string) { // Menggunakan 'category' (String)
    return this.serviceBookingsService.findAllForAdmin(categoryName);
  }
}