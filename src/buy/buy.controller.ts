import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BuyService } from './buy.service';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBuyDto: CreateBuyDto, @Request() req) {
    const userId = req.user.id;
    return this.buyService.create(createBuyDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({ name: 'productId', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('partnerId') partnerId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.buyService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy,
      order,
      partnerId,
      productId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyDto: UpdateBuyDto) {
    return this.buyService.update(id, updateBuyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyService.remove(id);
  }
}
