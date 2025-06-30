import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadValidationPipe implements PipeTransform {
  transform(files: any) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('Kamida bitta fayl yuboring');
    }

    for (const file of files) {
      if (!file.mimetype || !file.originalname) {
        throw new BadRequestException('Notogri fayl yuborildi');
      }
    }

    return files;
  }
}
