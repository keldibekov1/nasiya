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

  
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: 'seller' | 'customer',
    isActive?: boolean,
    sortBy: 'fullname' | 'balance' = 'fullname',
    sortOrder: 'asc' | 'desc' = 'asc',
    debtOnly: boolean = false,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { adress: { contains: search, mode: 'insensitive' } },
        { phone: { has: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (debtOnly) {
      where.balance = { lt: 0 };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.partners.findMany({
        where,
        include: {
          user: {
            select: { fname: true, lname: true },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { pin: 'desc' }, 
          { [sortBy]: sortOrder },
        ],
      }),
      this.prisma.partners.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      currentPage: page,
      totalPages,
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
