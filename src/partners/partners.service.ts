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
  async findByRole(role: 'custumer' | 'seller', page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.partners.findMany({
        where: { role },
        include: {
          user: { select: { fname: true, lname: true } },
        },
        skip,
        take: limit,
        orderBy: { fullname: 'asc' },
      }),
      this.prisma.partners.count({
        where: { role },
      }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
