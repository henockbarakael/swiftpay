import { Injectable } from '@nestjs/common';
import { ActionOperationEnum } from '@prisma/client';
import { DatabaseService } from 'shared/database';

@Injectable()
export class WalletService {
  constructor(private readonly service: DatabaseService) {}

  async getWalletbyCurrency(
    merchantId: string,
    currency: string,
  ): Promise<any> {
    const wallet = await this.service.merchantWallet.findFirst({
      where: {
        merchantId: merchantId,
        currency: {
          currency: currency,
        },
      },
    });

    return wallet;
  }

  private async performUpdate(
    wallet: any,
    amount: number,
    action: string,
  ): Promise<any> {
    const previousBalance = wallet.balance;
    const actualBalance =
      action === 'debit' ? wallet.balance + amount : wallet.balance - amount;
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
        action:
          action.toUpperCase() === ActionOperationEnum.CREDIT
            ? ActionOperationEnum.CREDIT
            : ActionOperationEnum.DEBIT,
        amount: amount,
        previousBalance: previousBalance,
        actualBalance: actualBalance,
        merchantWalletId: wallet.id,
      },
    });

    return { update: update, create: create };
  }

  isEnoughMoney(wallet: any, amount: number): boolean {
    return wallet.balance > amount ? true : false;
  }

  async debitWallet(
    currency: string,
    merchantId: string,
    amount: number,
  ): Promise<any> {
    const wallet = await this.getWalletbyCurrency(merchantId, currency);

    return await this.performUpdate(wallet, amount, 'debit');
  }

  async creditWallet(
    currency: string,
    merchantId: string,
    amount: number,
  ): Promise<any> {
    const wallet = await this.getWalletbyCurrency(merchantId, currency);

    const check = this.isEnoughMoney(wallet, amount);

    if (check) {
      return await this.performUpdate(wallet, amount, 'credit');
    } else {
      return false;
    }
  }

  async refund(
    amount: number,
    merchantId: string,
    currency: string,
  ): Promise<any> {
    const wallet = await this.service.merchantWallet.findFirst({
      where: {
        merchantId: merchantId,
        currency: {
          currency: currency,
        },
      },
    });

    return await this.performUpdate(wallet, amount, 'debit');
  }
}
