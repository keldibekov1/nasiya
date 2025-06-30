import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto, @Request() req) {
    const userId = req.user.id;
    return this.partnersService.create(createPartnerDto, userId);
  }

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('customers')
  getCustomers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.partnersService.findByRole('custumer', +page, +limit);
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('sellers')
  getSellers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.partnersService.findByRole('seller', +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.partnersService.update(id, updatePartnerDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
