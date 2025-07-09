import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContractDto, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const partner = await tx.partners.findUnique({
        where: { id: data.partnerId },
      });

      if (!partner) throw new NotFoundException('Partner topilmadi');

      let totalAmount = 0;

      for (const item of data.products) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new NotFoundException('Mahsulot topilmadi');
        if (product.quantity === null || product.quantity < item.quantity) {
          throw new BadRequestException(
            `Mahsulot (${product.title}) omborda yetarli emas`,
          );
        }

        if (product.totalPrice === null || product.price === null) {
          throw new BadRequestException(
            `Mahsulot (${product.title}) narxlari mavjud emas`,
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: product.quantity - item.quantity,
            totalPrice: product.totalPrice - product.price * item.quantity,
          },
        });

        totalAmount += item.quantity * item.sellPrice;
      }

      await tx.partners.update({
        where: { id: data.partnerId },
        data: {
          balance: partner.balance - totalAmount,
        },
      });

      const contract = await tx.contract.create({
        data: {
          partnerId: data.partnerId,
          userId,
          totalAmount,
          time: data.time,
        },
      });

      for (const item of data.products) {
        await tx.contractItem.create({
          data: {
            contractId: contract.id,
            productId: item.productId,
            quantity: item.quantity,
            sellPrice: item.sellPrice,
          },
        });
      }

      await tx.debt.create({
        data: {
          contractId: contract.id,
          total: totalAmount,
          totalPaid: 0,
          remaining: totalAmount,
          time: data.time,
          partnerId: data.partnerId,
        },
      });

      return contract;
    });
  }

  async findAll(query?: { partnerId?: string; page?: string; limit?: string }) {
    const { partnerId, page = '1', limit = '10' } = query || {};
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const whereClause: any = {};
    if (partnerId) {
      whereClause.partnerId = partnerId;
    }

    const [contracts, total] = await this.prisma.$transaction([
      this.prisma.contract.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          partner: {select:{fullname:true,}},
          user: {select:{fname:true,lname:true,username:true}},
          items: {
            include: {
              product: {select:{title:true}},
            },
          },
        },
      }),
      this.prisma.contract.count({
        where: whereClause,
      }),
    ]);

    return {
      data: contracts,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException('Contract topilmadi');
    }
    return contract;
  }

  update(id: string, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  async remove(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException('Contract topilmadi');
    }
    return this.prisma.contract.delete({ where: { id } });
  }
}
