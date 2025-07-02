import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, Pmnt } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Debt } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreatePaymentDto, userId: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id: data.partnerId },
    });
    if (!partner) {
      throw new NotFoundException('Partner topilmadi');
    }
    let debt: Debt | null = null;

    if (data.paymentType === Pmnt.out) {
      await this.prisma.partners.update({
        where: { id: data.partnerId },
        data: { balance: { decrement: data.amaunt } },
      });
    }

    if (data.paymentType === 'in') {
      if (!data.debtId) {
        throw new BadRequestException('paymentType in bolsa, debtId kerak');
      }

      debt = await this.prisma.debt.findUnique({
        where: { id: data.debtId },
      });

      if (!debt) {
        throw new NotFoundException('Debt topilmadi');
      }

      await this.prisma.partners.update({
        where: { id: data.partnerId },
        data: { balance: { increment: data.amaunt } },
      });
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        userId,
      },
    });

    return payment;
  }

  async findAll(page: number, limit: number, partnerId?: string) {
    const skip = (page - 1) * limit;

    const where = partnerId ? { partnerId } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          partner: true,
          user: true,
          debt: true,
        },
      }),
      this.prisma.payment.count({ where }),
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
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    if (!payment) {
      throw new NotFoundException('payment topilmadi');
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existing = await this.prisma.payment.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Payment topilmadi`);
    }

    return await this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    if (!payment) {
      throw new NotFoundException('payment topilmadi');
    }
    return await this.prisma.payment.delete({
      where: { id },
    });
  }
}
