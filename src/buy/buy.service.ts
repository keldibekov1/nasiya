import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BuyService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(data: CreateBuyDto, userId: string) {
    let product = data.productId
      ? await this.prisma.product.findUnique({ where: { id: data.productId } })
      : null;

    const partner = await this.prisma.partners.findUnique({
      where: { id: data.partnerId },
    });

    if (!partner) throw new NotFoundException('Partner topilmadi');
    if (partner.role !== 'seller') {
      throw new BadRequestException('Buy faqat seller bilan bolishi mumkin');
    }

    let productId: string;

    if (!product) {
      if (!data.title || !data.categoryId) {
        throw new BadRequestException(
          'Yangi mahsulot yaratish uchun title va categoryId kerak',
        );
      }
      let searchprd = await this.prisma.product.findFirst({where:{title:data.title}})
      if (searchprd) {
        throw new BadRequestException("bu product omborda bor")
      }

      product = await this.prisma.product.create({
        data: {
          title: data.title,
          categoryId: data.categoryId,
          quantity: data.quantity,
          totalPrice: data.buyPrice * data.quantity,
          price: data.buyPrice,
          units: data.units,
          comment: data.comment,
        },
      });

      productId = product.id;
    } else {
      const oldQuantity = product.quantity ?? 0;
      const oldTotalPrice = product.totalPrice ?? 0;

      const newQuantity = oldQuantity + data.quantity;
      const newTotalPrice = oldTotalPrice + data.buyPrice * data.quantity;
      const newAvgPrice = newTotalPrice / newQuantity;

      product = await this.prisma.product.update({
        where: { id: product.id },
        data: {
          quantity: newQuantity,
          totalPrice: newTotalPrice,
          price: newAvgPrice,
        },
      });

      productId = product.id;
    }

    const totalBuyAmount = data.buyPrice * data.quantity;

    const [createdBuy] = await this.prisma.$transaction([
      this.prisma.buy.create({
        data: {
          userId,
          partnerId: data.partnerId,
          productId,
          quantity: data.quantity,
          buyPrice: data.buyPrice,
          comment: data.comment,
          totalPrice: totalBuyAmount,
        },
      }),

      this.prisma.partners.update({
        where: { id: data.partnerId },
        data: {
          balance: { increment: totalBuyAmount },
        },
      }),
    ]);

    const message = `${partner.fullname} partnerdan "${product.title}" mahsuloti ${data.quantity} dona sotib olindi.`;
    await this.notificationService.notifyAllUsers(message);

    return createdBuy;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    partnerId?: string;
    productId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      partnerId,
      productId,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};


    if (partnerId) where.partnerId = partnerId;
    if (productId) where.productId = productId;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.buy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          user: { select: { fname: true, lname: true } },
          partner: { select: { fullname: true, phone: true } },
          product: { select: { title: true, price: true } },
        },
      }),

      this.prisma.buy.count({ where }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
