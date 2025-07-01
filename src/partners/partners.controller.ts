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
  Query,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
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

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false, enum: ['seller', 'customer'] })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['fullname', 'balance'] }) 
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }) 
  @ApiQuery({ name: 'debtOnly', required: false, example: true }) 
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: 'seller' | 'customer',
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: 'fullname' | 'balance',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('debtOnly') debtOnly?: string,
  ) {
    const parsedIsActive =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    const parsedDebtOnly = debtOnly === 'true';

    return this.partnersService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
      role,
      parsedIsActive,
      sortBy,
      sortOrder,
      parsedDebtOnly,
    );
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
