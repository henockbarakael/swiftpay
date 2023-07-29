import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'shared/database';

@Injectable()
export class WalletService {
  constructor(private readonly service: DatabaseService) {}

  private async getWalletbyCurrency() {}

  private async isEnoughMoney() {}

  async debitWallet(currency: string, merchantId: string, amount: string) {
    const wallet = await this.service.merchantWallet.findUnique({
      where: {
        merchantId: merchantId,
      },
    });
  }

  async creditWallet(currency: string, merchantId: string, amount: string) {}
}
