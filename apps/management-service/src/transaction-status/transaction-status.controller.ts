import { Controller, Get, Body } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatus } from './dto/transaction.dto';

@Controller()
export class TransactionStatusController {
  constructor(
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  @Get()
  async getHello(@Body() update: TransactionStatus): Promise<any> {
    return await this.transactionStatusService.updateTransactionStatus(update);
  }
}
