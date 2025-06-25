import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreatePartnerDto, userId: string) {
    return await this.prisma.partners.create({
      data: { ...data, balance: 0, userId: userId },
    });
  }

  async findAll() {
    return await this.prisma.partners.findMany({
      include: { user: { select: { fname: true, lname: true } } },
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
      include: { user: { select: { fname: true, lname: true } } },
    });

    if (!partner) {
      throw new NotFoundException('Bunday partner topilmadi');
    }
    return partner;
  }

  async update(id: string, data: UpdatePartnerDto, userId: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException('Bunday partner topilmadi');
    }

    return await this.prisma.partners.update({
      where: { id },
      data: { ...data, userId },
    });
  }

  async remove(id: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException('Bunday partner topilmadi');
    }
    return this.prisma.partners.delete({
      where: { id },
    });
  }
}
