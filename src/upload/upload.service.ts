import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async saveFiles(files: Express.Multer.File[]) {
    const createdFiles = await Promise.all(
      files.map((file) =>
        this.prisma.upload.create({
          data: {
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
          },
        }),
      ),
    );

    return {
      message: `${createdFiles.length} ta fayl saqlandi`,
      count: createdFiles.length,
      files: createdFiles,
    };
  }

  async findAll() {
    return this.prisma.upload.findMany();
  }

  async findOne(id: string) {
    const file = await this.prisma.upload.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Fayl topilmadi');
    return file;
  }

  async delete(id: string) {
    const file = await this.prisma.upload.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Fayl topilmadi');

    const filePath = path.join(
      __dirname,
      '../../uploads',
      path.basename(file.fileUrl),
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await this.prisma.upload.delete({ where: { id } });
    return { message: 'Fayl o‘chirildi' };
  }
}
