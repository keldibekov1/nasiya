import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuyService {
  constructor(private prisma: PrismaService) {}

async create(data: CreateBuyDto, userId: string) {
  const product = await this.prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) throw new NotFoundException('Mahsulot topilmadi');

  const partner = await this.prisma.partners.findUnique({
    where:{id:data.partnerId}
  })

  if (!partner) throw new NotFoundException('Partner topilmadi');


  const oldQuantity = product.quantity ?? 0;
  const oldTotalPrice = product.totalPrice ?? 0;

  const newQuantity = oldQuantity + data.quantity;
  const newTotalPrice = oldTotalPrice + data.buyPrice * data.quantity;

  const newAvgPrice = newQuantity > 0 ? newTotalPrice / newQuantity : data.buyPrice;

  const result = await this.prisma.$transaction([
    this.prisma.buy.create({
      data: { ...data, userId },
    }),
    this.prisma.product.update({
      where: { id: data.productId },
      data: {
        quantity: newQuantity,
        totalPrice: newTotalPrice,
        price: newAvgPrice, 
      },
    }),
  ]);

  return result[0];
}



  async findAll() {
    return await this.prisma.buy.findMany({
      include: {
        user: { select: { fname: true, lname: true } },
        partner: { select: { fullname: true, phone: true } },
        product: { select: { title: true, price: true } },
      },
    });
  }

  async findOne(id: string) {
    const buy = await this.prisma.buy.findUnique({
      where: { id },
      include: {
        user: { select: { fname: true, lname: true } },
        partner: { select: { fullname: true } },
        product: { select: { title: true } },
      },
    });
    if (!buy) throw new NotFoundException('topilmadi');
    return buy;
  }

  async update(id: string, data: UpdateBuyDto) {
    const buy = await this.prisma.buy.findUnique({ where: { id } });
    if (!buy) throw new NotFoundException('topilmadi');

    return await this.prisma.buy.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const buy = await this.prisma.buy.findUnique({ where: { id } });
    if (!buy) throw new NotFoundException('topilmadi');

    return await this.prisma.buy.delete({ where: { id } });
  }
}
