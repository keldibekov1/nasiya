import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  

  @Get()
  findAll() {
    return this.debtService.findAll();
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
