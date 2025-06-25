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

    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    if (product.quantity === null || product.quantity < data.quantity) {
      throw new BadRequestException('Omborda yetarli mahsulot yoq');
    }

    await tx.product.update({
      where: { id: data.productId },
      data: { quantity: product.quantity - data.quantity },
    });

    const totalAmount = data.quantity * data.sellPrice;

    await tx.partners.update({
      where: { id: data.partnerId },
      data: { balance: (partner.balance ?? 0) - totalAmount },
    });

    return await tx.contract.create({
      data: { ...data, userId,totalAmount },
    });
  });
}


  async findAll() {
    return await this.prisma.contract.findMany();
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
