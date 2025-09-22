// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; // <-- Impor RegisterDto

@Injectable()
export class AuthService {
  // Hapus PrismaService dari constructor karena tidak dipakai
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Ganti 'body: any' dengan 'registerDto: RegisterDto'
  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOne(registerDto.email);
    if (userExists) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: 'Registrasi berhasil',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return {
      message: 'Login berhasil',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}