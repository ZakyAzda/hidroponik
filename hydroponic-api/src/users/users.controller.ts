import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common'; // <-- SUDAH DIPERBAIKI (Ada Get & Req)
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Patch, Delete, Param, ParseIntPipe } from '@nestjs/common'; // Tambah Patch, Delete, Param

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- Endpoint Buat User (Khusus Admin) ---
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // --- Endpoint Tambah Alamat (User Login) ---
  @UseGuards(AuthGuard) // Wajib login
  @Post('addresses')
  addAddress(@Req() req, @Body() dto: CreateAddressDto) {
    // Pastikan req.user.sub atau req.user.userId sesuai dengan JwtStrategy Anda
    // Biasanya req.user.userId jika mengikuti tutorial sebelumnya
    const userId = req.user.userId || req.user.sub; 
    return this.usersService.addAddress(userId, dto);
  }

  // --- Endpoint Lihat Alamat (User Login) ---
  @UseGuards(AuthGuard) // Wajib login
  @Get('addresses')
  getAddresses(@Req() req) {
    const userId = req.user.userId || req.user.sub;
    return this.usersService.getAddresses(userId);
  }
@UseGuards(AuthGuard)
  @Patch('password')
  updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    const userId = req.user.userId || req.user.sub;
    return this.usersService.updatePassword(userId, dto);
  }

  // --- ENDPOINT HAPUS ALAMAT ---
  @UseGuards(AuthGuard)
  @Delete('addresses/:id')
  deleteAddress(@Req() req, @Param('id', ParseIntPipe) addressId: number) {
    const userId = req.user.userId || req.user.sub;
    return this.usersService.deleteAddress(userId, addressId);
  }
}