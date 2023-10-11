import { Module } from '@nestjs/common';
import { ManagementServiceController } from './management-service.controller';
import { ManagementServiceService } from './management-service.service';
import { MerchantCommissionModule } from './merchant-commission/merchant-commission.module';

@Module({
  imports: [MerchantCommissionModule],
  controllers: [ManagementServiceController],
  providers: [ManagementServiceService],
})
export class ManagementServiceModule {}
