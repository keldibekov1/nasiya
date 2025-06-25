import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return this.checkCategoryExists(id);
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.checkCategoryExists(id);
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.checkCategoryExists(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async checkCategoryExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Bunday category yoq');
    }
    return category;
  }
}
