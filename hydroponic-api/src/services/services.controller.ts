import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator';

@Controller('services')
// HAPUS @UseGuards DARI SINI AGAR GET BISA DIAKSES PUBLIK
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // --- HANYA ADMIN YANG BOLEH CREATE ---
  @Post()
  @UseGuards(AuthGuard, RolesGuard) // <-- Pasang Guard Disini
  @Roles(UserRole.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  // --- PUBLIK BOLEH LIHAT (TANPA GUARD) ---
  @Get()
  findAll(@Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number) {
    return this.servicesService.findAll(categoryId);
  }

  // --- PUBLIK BOLEH LIHAT DETAIL (TANPA GUARD) ---
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  // --- HANYA ADMIN YANG BOLEH UPDATE ---
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard) // <-- Pasang Guard Disini
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  // --- HANYA ADMIN YANG BOLEH HAPUS ---
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard) // <-- Pasang Guard Disini
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }

  // --- HANYA ADMIN YANG BOLEH UPLOAD ---
  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard) // <-- Pasang Guard Disini
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      imageUrl: `http://localhost:3000/uploads/${file.filename}`,
    };
  }
}