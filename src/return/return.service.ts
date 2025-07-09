import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReturnService {
  constructor(private prisma: PrismaService) {}



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
