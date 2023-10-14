import { Module } from '@nestjs/common';
import { MerchantCommissionService } from './merchant-commission.service';
import { MerchantCommissionController } from './merchant-commission.controller';

@Module({
  controllers: [MerchantCommissionController],
  providers: [MerchantCommissionService],
  exports: [MerchantCommissionService],
})
export class MerchantCommissionModule {}
