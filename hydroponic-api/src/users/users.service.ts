import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Method untuk mencari user berdasarkan email
  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Method untuk membuat user (akan dipanggil oleh AuthService)
  async create(data: any) {
    return this.prisma.user.create({ data });
  }
}