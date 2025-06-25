import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { BuyModule } from './buy/buy.module';
import { ContractModule } from './contract/contract.module';
import { ReturnModule } from './return/return.module';
import { SalaryModule } from './salary/salary.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ProductModule, PrismaModule, CategoryModule, UserModule, AuthModule, PartnersModule, BuyModule, ContractModule, ReturnModule, SalaryModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
