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
import { DebtModule } from './debt/debt.module';
import { NotificationModule } from './notification/notification.module';
import { UploadModule } from './upload/upload.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guard/Throttler.Guard';


@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ProductModule,
    PrismaModule,
    CategoryModule,
    UserModule,
    AuthModule,
    PartnersModule,
    BuyModule,
    ContractModule,
    ReturnModule,
    SalaryModule,
    PaymentModule,
    DebtModule,
    NotificationModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_GUARD,
    useClass: CustomThrottlerGuard,
  },],
})
export class AppModule {}
