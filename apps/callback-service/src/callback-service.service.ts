import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'shared/database';
import { Callback } from './dto/callback.dto';
import { WalletService } from 'shared/wallet';

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
      }
    });

    if (data.Status === 'Failed') {
      if(transaction.action.toLowerCase() == "credit"){
        await this.walletService.refund(transaction.)
      }
    } else {
    }
  }
}
