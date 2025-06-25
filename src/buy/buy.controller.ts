import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { BuyService } from './buy.service';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBuyDto: CreateBuyDto,@Request() req) {
    const userId = req.user.id; 
    return this.buyService.create(createBuyDto,userId);
  }

  @Get()
  findAll() {
    return this.buyService.findAll();
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
