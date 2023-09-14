import { Module } from '@nestjs/common';
import { AccountStatusService } from './account-status.service';
import { AccountStatusController } from './account-status.controller';

@Module({
  controllers: [AccountStatusController],
  providers: [AccountStatusService],
})
export class AccountStatusModule {}
