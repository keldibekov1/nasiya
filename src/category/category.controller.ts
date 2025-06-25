import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Kategoriya yaratildi' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Kategoriyalar royxati' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Kategoriya ID si',
    example: 'b60c4d2a-02e4-4bdf-a56c-3b234807a8b1',
  })
  @ApiResponse({ status: 200, description: 'Topilgan kategoriya' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Kategoriya yangilandi' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Kategoriya ochirildi' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
