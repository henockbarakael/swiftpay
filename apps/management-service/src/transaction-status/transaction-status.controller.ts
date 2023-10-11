import { Controller, Get } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';

@Controller()
export class TransactionStatusController {
  constructor(
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  @Get()
  getHello(): string {
    return this.transactionStatusService.getHello();
  }
}
