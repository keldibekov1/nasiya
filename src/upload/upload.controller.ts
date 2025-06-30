import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from './upload.service';
import { UploadValidationPipe } from './upload-validation.pipe';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Multiple fayl yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fayllar yuklandi' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: path.join(__dirname, '../../uploads'),
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${uuid()}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles(new UploadValidationPipe()) files: Express.Multer.File[],
  ) {
    return this.uploadService.saveFiles(files);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.uploadService.delete(id);
  }
}
