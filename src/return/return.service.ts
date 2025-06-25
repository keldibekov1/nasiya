import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReturnService {
  constructor(private prisma: PrismaService) {}
async create(data: CreateReturnDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: data.contractId },
    });
    if (!contract) {
      throw new NotFoundException('Contract topilmadi');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: contract.productId },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    

    const partner = await this.prisma.partners.findUnique({
      where: { id: contract.partnerId },
    });
    if (!partner) throw new NotFoundException('Partner topilmadi');

    const totalAmount = contract.totalAmount;

    return await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: product.id },
        data: {
          quantity: product.quantity + contract.quantity,
        },
      });

      await tx.partners.update({
        where: { id: partner.id },
        data: {
          balance: partner.balance + totalAmount,
        },
      });

      const returnCreated = await tx.return.create({
        data: {
          contractId: data.contractId,
          isNew: data.isNew,
          reason: data.reason,
        },
      });

      return returnCreated;
    });
  }

  async findAll() {
    return await this.prisma.return.findMany();
  }

  async findOne(id: string) {
    const returnSingle = await this.prisma.return.findUnique({
      where: { id },
    });
    if (!returnSingle) {
      throw new NotFoundException('bu id return topilmadi');
    }

    return returnSingle;
  }

  update(id: string, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  async remove(id: string) {
    const returnSingle = await this.prisma.return.findUnique({
      where: { id },
    });
    if (!returnSingle) {
      throw new NotFoundException('bu id return topilmadi');
    }
    return await this.prisma.return.delete({
      where: { id },
    });
  }
}
