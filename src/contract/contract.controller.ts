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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto, @Request() req) {
    const userId = req.user.id;
    return this.contractService.create(createContractDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: String})
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('partnerId') partnerId?: string,
  ) {
    return this.contractService.findAll({ partnerId, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }
}
