import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateProductDto) {
    const { price, quantity,categoryId } = data;
    const category = await this.prisma.category.findUnique({
      where:{id:categoryId}
    })
    if (!category) {
      throw new NotFoundException("Category topilmadi")
    }
    const totalPrice = price * quantity;
    const newProduct = await this.prisma.product.create({
      data: { ...data, totalPrice },
    });
    return newProduct;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await this.prisma.product.findMany({
      skip,
      take:limit,
      
    });
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
