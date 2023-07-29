import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'shared/database';

@Injectable()
export class WalletService {
  constructor(private readonly service: DatabaseService) {}

  private async getWalletbyCurrency(
    merchantId: string,
    currency: string,
  ): Promise<any> {
    const wallet = await this.service.merchantWallet.findUnique({
      where: {
        merchantId: merchantId,
        currency: {
          currency: currency,
        },
      },
    });

    return wallet;
  }

  private async performUpdate(wallet: any, amount: number): Promise<any> {
    const previousBalance = wallet.balance;
    const actualBalance = wallet.balance + amount;
    wallet.balance = actualBalance;
    // update wallet
    const update = await this.service.merchantWallet.update({
      data: {
        balance: wallet.balance,
      },
      where: {
        id: wallet.id,
      },
    });

    // add new record to history
    const create = await this.service.merchantWalletHistory.create({
      data: {
        action: 'debit',
        amount: amount,
        previousBalance: previousBalance,
        actualBalance: actualBalance,
        merchantWalletId: wallet.id,
      },
    });

    return { update: update, create: create };
  }

  private isEnoughMoney(wallet: any, amount: number): boolean {
    return wallet.balance > amount ? true : false;
  }

  async debitWallet(
    currency: string,
    merchantId: string,
    amount: number,
  ): Promise<any> {
    const wallet = await this.getWalletbyCurrency(merchantId, currency);
    const check = this.isEnoughMoney(wallet, amount);

    if (check) {
      return await this.performUpdate(wallet, amount);
    } else {
      return false;
    }
  }

  async creditWallet(
    currency: string,
    merchantId: string,
    amount: number,
  ): Promise<any> {
    const wallet = await this.getWalletbyCurrency(merchantId, currency);

    return await this.performUpdate(wallet, amount);
  }

  async refund(
    amount: number,
    merchantId: string,
    currency: string,
  ): Promise<any> {
    const wallet = await this.service.merchantWallet.findUnique({
      where: {
        merchantId: merchantId,
        currency: {
          currency: currency,
        },
      },
    });

    return await this.performUpdate(wallet, amount);
  }
}
