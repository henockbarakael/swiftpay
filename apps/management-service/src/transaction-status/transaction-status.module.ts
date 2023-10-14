import { Module } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatusController } from './transaction-status.controller';

@Module({
  controllers: [TransactionStatusController],
  providers: [TransactionStatusService],
  exports: [TransactionStatusService],
})
export class TransactionStatusModule {}
