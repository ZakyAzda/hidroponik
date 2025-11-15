import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
}