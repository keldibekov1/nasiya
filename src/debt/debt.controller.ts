import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { DebtService } from './debt.service';

@ApiTags('debt')
@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sortlash',
    example: 'desc',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('partnerId') partnerId?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.debtService.findAll({
      partnerId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
