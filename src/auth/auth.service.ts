import {
  Get,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMeDto } from './dto/UpdateMeDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(data: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (!user) {
      throw new UnauthorizedException('Username yoki password xato');
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Username yoki password xato');
    }
    const role = user.role;
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { token, role };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    return user;
  }

  async updateMe(userId: string, data: Partial<UpdateMeDto>) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (data.username && data.username !== user.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existing && existing.id !== userId) {
        throw new UnauthorizedException('Bu username allaqachon band');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async resetPassword(userId: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
