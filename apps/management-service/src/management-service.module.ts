import { Module } from '@nestjs/common';
import { ManagementServiceController } from './management-service.controller';
import { ManagementServiceService } from './management-service.service';
import { DatabaseModule } from 'shared/database';
import { AuthModule } from './auth/auth.module';
import { UserSupportModule } from './user-support/user-support.module';
import { InstitutionModule } from './institution/institution.module';
import { ServiceModule } from './service/service.module';
import { MerchantModule } from './merchant/merchant.module';
import { AccountStatusModule } from './account-status/account-status.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { MerchantCommissionModule } from './merchant-commission/merchant-commission.module';
import { AgregatorParameterModule } from './agregator-parameter/agregator-parameter.module';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserSupportModule,
    InstitutionModule,
    ServiceModule,
    MerchantModule,
    AccountStatusModule,
    BlacklistModule,
    MerchantCommissionModule,
    AgregatorParameterModule,
    TransactionStatusModule,
  ],
  controllers: [ManagementServiceController],
  providers: [ManagementServiceService],
})
export class ManagementServiceModule {}
