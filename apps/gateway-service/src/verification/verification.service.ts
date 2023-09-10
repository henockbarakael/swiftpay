import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
import { DatabaseService } from 'shared/database';
import { ActionOperationEnum } from '@prisma/client';
import {
  isObjectsEqual,
  referenceGenerator,
  checkValidOperator,
} from 'libs/utils';
import { ClientKafka } from '@nestjs/microservices';
import { EncryptionService } from 'shared/encryption';
@Injectable()
export class VerificationService {
  constructor(
    private dbService: DatabaseService,
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientKafka,
    private encryptionService: EncryptionService,
  ) {}

  async checkMarchant(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    const key = checkMarchantVerificationDto.key;
    let wallet = null;

    try {
      const existMarchant = await this.dbService.merchant.findUniqueOrThrow({
        where: {
          id: checkMarchantVerificationDto.machantID,
        },
        include: {
          user: true,
        },
      });

      const [existService, existCurrency] = await this.checkServiceAndCurrency(
        checkMarchantVerificationDto,
      );

      if (Object.keys(existMarchant).length !== 0) {
        if (existService.length !== 0 && existCurrency.length !== 0) {
          if (
            checkMarchantVerificationDto.action === ActionOperationEnum.DEBIT ||
            checkMarchantVerificationDto.action === ActionOperationEnum.CREDIT
          ) {
            const isIntegrity = await this.integrityCheck(
              checkMarchantVerificationDto,
              key,
            );
            // check if the customer number match operator schemas
            if (
              !checkValidOperator(
                checkMarchantVerificationDto.customerNumber,
                existService[0].name,
              )
            ) {
              return false;
            }

            // store transaction in the database
            await this.dbService.dailyOperation.create({
              data: {
                amount: checkMarchantVerificationDto.amount,
                merchantReference: checkMarchantVerificationDto.reference,
                telcoReference: '',
                telcoStatus: '',
                telcoStatusDescription: '',
                currencyId: existCurrency[0].id,
                serviceId: existService[0].id,
                transactionStatusId: 'PENDING',
                reference: referenceGenerator(),
                customerNumber: checkMarchantVerificationDto.customerNumber,
              },
            });

            // verifify integrity
            if (isIntegrity) {
              wallet = await this.dbService.merchantWallet.findMany({
                where: {
                  AND: [
                    {
                      merchantId: existMarchant.id,
                    },
                    {
                      balance: checkMarchantVerificationDto.amount,
                    },
                  ],
                },
              });
              this.notificationService.send(
                'send-wallet-verification',
                JSON.stringify({
                  to: existMarchant.user.email,
                  marchant: existMarchant.user,
                }),
              );
            } else {
              return false;
            }

            // blacklist check
            const isBlacklisted = await this.blacklistCheck(
              checkMarchantVerificationDto.customerNumber,
            );

            // service authorization check
            const isServiceAuthorization = await this.serviceAuthorizationCheck(
              checkMarchantVerificationDto.service,
              checkMarchantVerificationDto.merchantID,
            );

            // action autorization
            const isAuthorizedAction = await this.actionAuthorizationCheck(
              checkMarchantVerificationDto.action,
              checkMarchantVerificationDto.merchantID,
            );

            // transaction limit check
            const isTransactionLimited = await this.transactionLimitCheck(
              checkMarchantVerificationDto.merchantID,
              checkMarchantVerificationDto.amount,
            );

            // write to kafka

            // send ACK
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      throw new NotAcceptableException(
        'Impossible de valider votre verifaction',
      );
    }
  }

  async checkServiceAndCurrency(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    const [existService, existCurrency] = await Promise.all([
      // check service
      await this.dbService.service.findMany({
        where: {
          AND: [
            {
              name: checkMarchantVerificationDto.service,
            },
          ],
        },
      }),

      await this.dbService.currency.findMany({
        where: {
          AND: [
            {
              currency: checkMarchantVerificationDto.currency,
            },
          ],
        },
      }),
    ]);

    return [existService, existCurrency];
  }

  async integrityCheck(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
    key: string,
  ) {
    const decrypted = decodeURIComponent(
      JSON.parse(this.encryptionService.decrypt(key, true)),
    );
    delete checkMarchantVerificationDto.key;

    const isIntegrity = isObjectsEqual(decrypted, checkMarchantVerificationDto);

    return isIntegrity;
  }

  async blacklistCheck(phone: string) {
    const number = await this.dbService.blacklistNumber.findMany({
      where: {
        number: {
          equals: phone,
        },
      },
    });

    if (number.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  async serviceAuthorizationCheck(service: string, merchantId: string) {
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'SERVICE',
      },
    });

    const restriction = params.find(
      (e) => e.value.toLowerCase() === service.toLowerCase(),
    );

    if (restriction !== undefined) {
      return true;
    }
    return false;
  }

  async actionAuthorizationCheck(action: string, merchantId: string) {
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'ACTION',
      },
    });

    const restriction = params.find(
      (e) => e.value.toLowerCase() === action.toLowerCase(),
    );

    if (restriction !== undefined) {
      return true;
    }
    return false;
  }

  async transactionLimitCheck(merchantId: string, amount: number) {
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'TRANSACTION',
      },
    });

    const restriction = params.find((e) => parseFloat(e.value) > amount);

    if (restriction !== undefined) {
      return true;
    }
    return false;
  }
}
