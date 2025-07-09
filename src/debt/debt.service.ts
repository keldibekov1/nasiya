import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface FindAllParams {
  partnerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

@Injectable()
export class DebtService {
  constructor(private prisma: PrismaService) {}

async findAll(params: FindAllParams) {
  const {
    partnerId,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = params;

  const where = partnerId ? { partnerId } : {};

  const debts = await this.prisma.debt.findMany({
    where,
    orderBy: {
      createdAt: order,
    },
    include:{
      partner: {select:{fullname:true,phone:true}},
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await this.prisma.debt.count({ where });

  return {
    data: debts,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}


  async findOne(id: string) {
    const debt = await this.prisma.debt.findUnique({ where: { id } });
    if (!debt) throw new NotFoundException('Debt topilmadi');
    return debt;
  }

  async remove(id: string) {
    const debt = await this.prisma.debt.findUnique({ where: { id } });
    if (!debt) throw new NotFoundException('Debt topilmadi');
    return this.prisma.debt.delete({ where: { id } });
  }
}
