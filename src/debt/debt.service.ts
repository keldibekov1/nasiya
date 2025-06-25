import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {

  constructor(private prisma:PrismaService){}
  

  async findAll() {
    return await this.prisma.debt.findMany();
  }

  async findOne(id: string) {
    let debt = await this.prisma.debt.findUnique({
      where:{id}
    })

    if (!debt) {
      throw new NotFoundException('debt topilmadi')
    }

    return debt;
  }


  async remove(id: string) {
     let debt = await this.prisma.debt.findUnique({
      where:{id}
    })

    if (!debt) {
      throw new NotFoundException('debt topilmadi')
    }
    return this.prisma.debt.delete({
      where:{id}
    });
  }
}
