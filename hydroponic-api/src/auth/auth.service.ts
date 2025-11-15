import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client'; // <-- Impor UserRole

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOne(registerDto.email);
    if (userExists) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Panggil create service dengan password asli, biarkan service yang melakukan hashing
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password, // <-- Kirim password asli
      role: UserRole.CUSTOMER,
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

    console.log('--- DIAGNOSIS LOGIN ---');
    console.log('Password dari Form:', loginDto.password);
    console.log('Password Hashed dari DB:', user.password);
    
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    console.log('Hasil Perbandingan (isMatch):', isMatch);
    console.log('-----------------------');

    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return {
      message: 'Login berhasil',
      access_token: await this.jwtService.signAsync(payload),
      user: payload, // Mengembalikan data user juga
    };
  }
}