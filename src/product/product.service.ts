import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { title } from 'process';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateProductDto) {
    let { price, quantity, categoryId } = data;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category topilmadi');
    }
    price = price || 0;
    quantity = quantity || 0;
    const totalPrice = price * quantity;
    const newProduct = await this.prisma.product.create({
      data: { ...data, totalPrice },
    });
    return newProduct;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    name?: string, 
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (name) where.title  = { contains: name, mode: 'insensitive' }; 

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Bunday product yoq');
    }
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    const updatPproduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!updatPproduct) {
      throw new NotFoundException('Bunday product yoq');
    }
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const deleteProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!deleteProduct) {
      throw new NotFoundException('Bunday product yoq');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
