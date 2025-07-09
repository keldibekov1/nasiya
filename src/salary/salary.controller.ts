import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { OwnerGuard } from 'src/guard/owner.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post()
  create(@Body() createSalaryDto: CreateSalaryDto) {
    return this.salaryService.create(createSalaryDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.salaryService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      userId,
      sort || 'desc',
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @Get('my')
  findMine(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    const userId = req.user.id;
    return this.salaryService.findMine(
      userId,
      Number(page) || 1,
      Number(limit) || 10,
      sort || 'desc',
    );
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    return this.salaryService.update(id, updateSalaryDto);
  }
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryService.remove(id);
  }
}
