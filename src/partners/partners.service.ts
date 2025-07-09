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
    isArchive?: boolean,
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
    } else {
      where.isActive = true; 
    }

    if (typeof isArchive === 'boolean') {
      where.isArchive = isArchive;
    } else {
      where.isArchive = false; 
    }

    if (debtOnly) {
      where.balance = { lt: 0 };
    }

    const orderBy: any[] = [{ pin: 'desc' }, { createdAt: sortOrder }];

    const [data, total] = await this.prisma.$transaction([
      this.prisma.partners.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.partners.count({ where }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
      include: {
        updatedBy: { select: { fname: true, lname: true } },
        createdBy: { select: { fname: true, lname: true } },
        
      },
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
