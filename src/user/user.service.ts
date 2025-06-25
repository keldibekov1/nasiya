import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}




  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new ConflictException('Bu username allaqachon mavjud');
    }

    const hashPswrd = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPswrd,
        balance: 0,
        role: Role.admin,
        isActive: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        fname: true,
        lname: true,
        username: true,
        phone: true,
        balance: true,
        isActive: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('Bunday user yoq');
    }
    return user;
  }

async update(id: string, data: UpdateUserDto) {
  const updateUser = await this.prisma.user.findUnique({ where: { id } });

  if (!updateUser) {
    throw new NotFoundException('Bunday user yoq');
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 7);
  }

  return await this.prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      fname: true,
      lname: true,
      username: true,
      phone: true,
      balance: true,
      role: true,
      isActive: true,
    },
  });
}


  async remove(id: string) {
    let deleteUser = await this.prisma.user.findUnique({ where: { id } });
    if (!deleteUser) {
      throw new NotFoundException('Bunday user yoq');
    }
    return deleteUser;
  }


}
