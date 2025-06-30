import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: {name: data.name}
    })
    if (category) {
      throw new ConflictException("Bu kategoriya borku")
    }
    return await this.prisma.category.create({ data });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return await this.checkCategoryExists(id);
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
