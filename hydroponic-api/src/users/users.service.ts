import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdatePasswordDto } from './dto/update-password.dto'; // Import DTO baru
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Method untuk mencari user berdasarkan email
  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Method untuk membuat user baru (oleh Admin)
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;

    // Cek apakah email sudah ada
    const existingUser = await this.findOne(email);
    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Hapus password dari objek yang dikembalikan
    const { password: _, ...result } = user;
    return result;
  }
  async addAddress(userId: number, dto: CreateAddressDto) {
    // Cek apakah ini alamat pertama user tersebut?
    const count = await this.prisma.address.count({ where: { userId } });
    
    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
        // Jika ini alamat pertama, otomatis jadikan Primary (Utama)
        isPrimary: count === 0, 
      },
    });
  }

  // 2. Ambil Semua Alamat User
  async getAddresses(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' }, // Yang utama muncul paling atas
    });
  }
async updatePassword(userId: number, dto: UpdatePasswordDto) {
    // 1. Cari User
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    // 2. Cek Password Lama (Match gak?)
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password lama salah!');
    }

    // 3. Hash Password Baru
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    // 4. Update ke Database
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password berhasil diubah' };
  }
  
  // --- TAMBAHAN: FUNGSI HAPUS ALAMAT (Biar lengkap) ---
  async deleteAddress(userId: number, addressId: number) {
    // Pastikan alamat itu milik user yang request
    const address = await this.prisma.address.findFirst({
        where: { id: addressId, userId }
    });
    
    if(!address) throw new BadRequestException("Alamat tidak ditemukan");

    return this.prisma.address.delete({
        where: { id: addressId }
    });
  }
}
