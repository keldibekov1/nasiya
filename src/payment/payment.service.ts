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
  async create(data: CreatePaymentDto,userId:string) {
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
        userId
      },
    });



   
    
    return payment;
  }

  async findAll() {
    return await this.prisma.payment.findMany();
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

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
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
