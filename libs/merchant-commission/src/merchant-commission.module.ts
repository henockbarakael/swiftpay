import { Module } from '@nestjs/common';
import { MerchantCommissionService } from './merchant-commission.service';

@Module({
  providers: [MerchantCommissionService],
  exports: [MerchantCommissionService],
})
export class MerchantCommissionModule {}
