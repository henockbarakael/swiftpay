import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'shared/database';
import { Callback } from './dto/callback.dto';
import { WalletService } from 'shared/wallet';
import axios from 'axios';

@Injectable()
export class CallbackServiceService {
  constructor(
    private dbService: DatabaseService,
    private walletService: WalletService,
  ) {}

  async processCallback(data: Callback) {
    console.log(data);
    const transaction = await this.dbService.dailyOperation.findUnique({
      where: {
        reference: data.Reference,
      },
    });

    if (data.Trans_Status === 'Failed') {
      const transactionStatus =
        await this.dbService.transactionStatus.findFirst({
          where: {
            status: 'FAILED',
          },
        });

      if (transaction.action.toLowerCase() == 'credit') {
        await this.walletService.refund(
          transaction.amount,
          transaction.merchantId,
          data.Currency,
        );

        await this.dbService.transaction.update({
          data: {
            transactionStatusId: transactionStatus.id,
            telcoReference: data.Reference,
          },
          where: {
            reference: transaction.reference,
          },
        });
      } else {
        await this.dbService.transaction.update({
          data: {
            transactionStatusId: transactionStatus.id,
            telcoReference: data.Reference,
          },
          where: {
            reference: transaction.reference,
          },
        });
      }
    } else {
      const transactionStatus =
        await this.dbService.transactionStatus.findFirst({
          where: {
            status: 'SUCCESS',
          },
        });

      if (transaction.action.toLowerCase() == 'credit') {
        await this.dbService.transaction.update({
          data: {
            transactionStatusId: transactionStatus.id,
            telcoReference: data.Reference,
          },
          where: {
            reference: transaction.reference,
          },
        });
      } else {
        await this.walletService.debitWallet(
          data.Currency,
          transaction.merchantId,
          transaction.amount,
        );

        await this.dbService.transaction.update({
          data: {
            transactionStatusId: transactionStatus.id,
            telcoReference: data.Reference,
          },
          where: {
            reference: transaction.reference,
          },
        });

        // send callback
        await axios.post(transaction.callbackUrl, {
          Trans_Status: data.Trans_Status,
          Currency: data.Currency,
          Amount: data.Amount,
          Method: data.Action,
          Customer_Details: transaction.customerNumber,
          Reference: transaction.reference,
          Servce: data.Method,
        });
      }
    }
  }
}
