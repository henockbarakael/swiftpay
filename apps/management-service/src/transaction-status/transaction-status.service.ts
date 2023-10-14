import { Injectable } from '@nestjs/common';
import { TransactionStatus } from './dto/transaction.dto';
import { DatabaseService } from 'shared/database';

@Injectable()
export class TransactionStatusService {
  constructor(private readonly dbService: DatabaseService) {}

  async updateTransactionStatus(update: TransactionStatus): Promise<any> {
    let status = undefined;

    if (update.statusId !== undefined) {
      status = await this.dbService.transactionStatus.findFirst({
        where: {
          id: update.statusId,
        },
      });
    } else {
      status = await this.dbService.transactionStatus.findFirst({
        where: {
          status: update.statusLiteral,
        },
      });
    }

    if (status != undefined) {
      const transactionUpdateDO = await this.dbService.dailyOperation.update({
        data: {
          transactionStatusId: status.id,
        },
        where: {
          reference: update.Reference,
        },
      });

      const transactionUpdate = await this.dbService.transaction.update({
        data: {
          transactionStatusId: status.id,
        },
        where: {
          reference: update.Reference,
        },
      });

      return { success: true, transactionUpdateDO, transactionUpdate };
    } else {
      return false;
    }
  }
}
