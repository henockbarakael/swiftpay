import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
import { DatabaseService } from 'shared/database';
import { ActionOperationEnum } from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';
import { referenceGenerator, checkValidOperator } from 'libs/utils';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { WalletService } from 'shared/wallet';
@Injectable()

interface CheckMarchantResponse {
  success: boolean;
  ack: any;
}
const prisma = new PrismaClient();
export class GatewayService {
  constructor(
    private dbService: DatabaseService,
    @Inject('gateway') private gatewayClient: ClientKafka,
    private readonly walletService: WalletService,
  ) {}

  private readonly logger = new Logger(GatewayService.name);


  async checkMarchant(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ): Promise<{ success: boolean; ack: any; message: string }> {
    const key = checkMarchantVerificationDto.key;


    const existMarchant = await this.dbService.merchant.findUniqueOrThrow({
      where: {
        id: checkMarchantVerificationDto.merchantID,
      },
      include: {
        users: true,
      },
    });

    console.log(existMarchant);

    const { existService, existCurrency } = await this.checkServiceAndCurrency(
      checkMarchantVerificationDto,
    );

    console.log(existService, existCurrency);

    if (Object.keys(existMarchant).length !== 0) {
      if (existService.length !== 0 && existCurrency.length !== 0) {
        if (
          checkMarchantVerificationDto.action.toUpperCase() ===
            ActionOperationEnum.DEBIT ||
          checkMarchantVerificationDto.action.toUpperCase() ===
            ActionOperationEnum.CREDIT
        ) {
          const isIntegrity = await this.integrityCheck(
            checkMarchantVerificationDto,
            key,
          );

          console.log(isIntegrity);
          // check if the customer number match operator schemas
          console.log(checkValidOperator(
            checkMarchantVerificationDto.phoneNumber,
            existService[0].name,
          ))
          if (
            !checkValidOperator(
              checkMarchantVerificationDto.phoneNumber,
              existService[0].name,
            )
            
          ) {
            
            return false;
            
          }

          console.log('before db write');

          const transactionStatus =
            await this.dbService.transactionStatus.findFirst({
              where: {
                status: 'PENDING',
              },
            });

          // swyft reference
          const SwyftReference = referenceGenerator();
          const phoneNumberWithZero = checkMarchantVerificationDto.phoneNumber.padStart(10, '0');
          // store transaction in the database
          const ack = await this.dbService.dailyOperation.create({
            data: {
              amount: checkMarchantVerificationDto.amount,
              merchantReference: checkMarchantVerificationDto.reference,
              telcoReference: `${v4()}`,
              telcoStatus: '',
              telcoStatusDescription: '',
              currencyId: existCurrency[0].id,
              serviceId: existService[0].id,
              transactionStatusId: transactionStatus.id,
              reference: `${SwyftReference}`,
              customerNumber: phoneNumberWithZero,
              callbackUrl: checkMarchantVerificationDto.callback_url,
              action: checkMarchantVerificationDto.action,
              merchantId: checkMarchantVerificationDto.merchantID,
            },
          });

          try {
            // store transaction in the database
            
            const ack = await this.dbService.dailyOperation.create({
              data: {
                amount: checkMarchantVerificationDto.amount,
                merchantReference: checkMarchantVerificationDto.reference,
                telcoReference: `${v4()}`,
                telcoStatus: '',
                telcoStatusDescription: '',
                currencyId: existCurrency[0].id,
                serviceId: existService[0].id,
                transactionStatusId: transactionStatus.id,
                reference: `${SwyftReference}`,
                customerNumber: phoneNumberWithZero,
                callbackUrl: checkMarchantVerificationDto.callback_url,
                action: checkMarchantVerificationDto.action,
                merchantId: checkMarchantVerificationDto.merchantID,
              },
            });
        
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                if (error.meta?.target === 'daily_operation_merchantReference_key') {
                  console.log("Erreur : une opération quotidienne avec cette référence de marchand existe déjà.");
                  return {
                    success: false,
                    ack: null,
                    message: "La référence marchande existe déjà.",
                  };
                
                } else {
                  console.log("Erreur de contrainte unique :", error.meta?.target);
                  return {
                    success: false,
                    ack: null,
                    message: "Erreur de contrainte unique :"+ error.meta?.target,
                  };
                }
              } else {
                console.log("Erreur Prisma connue :", error.code);
                return {
                  success: false,
                  ack: null,
                  message: "Erreur Prisma connue :"+ error.code,
                };
              }
            } else {
              // Gestion des autres erreurs non Prisma
              console.log("Erreur inconnue :", error);
              return {
                success: false,
                ack: null,
                message: "Erreur Prisma connue :"+ error,
              };
            }
          }

          // wallet check and failed in case

          if (
            checkMarchantVerificationDto.action.toUpperCase() ===
            ActionOperationEnum.CREDIT
          ) {
            const wallet = await this.walletService.getWalletbyCurrency(
              checkMarchantVerificationDto.merchantID,
              checkMarchantVerificationDto.currency,
            );

            const isEnoughMoney = this.walletService.isEnoughMoney(
              wallet,
              checkMarchantVerificationDto.amount,
            );

            if (!isEnoughMoney) {
              const updateStatus =
                await this.dbService.transactionStatus.findFirst({
                  where: {
                    status: 'FAILED',
                  },
                });

              await this.dbService.dailyOperation.update({
                data: {
                  transactionStatusId: updateStatus.id,
                },
                where: {
                  id: SwyftReference,
                },
              });
              return false;
            } else {
              await this.walletService.creditWallet(
                checkMarchantVerificationDto.currency,
                checkMarchantVerificationDto.merchantID,
                checkMarchantVerificationDto.amount,
              );
            }
          }

          console.log(`db ack ${ack}`);

          console.log(isIntegrity);
          // verifify integrity
          if (!isIntegrity) {
            return false;
          }

          // blacklist check
          const isBlacklisted = await this.blacklistCheck(
            checkMarchantVerificationDto.phoneNumber,
          );

          // service authorization check
          const isServiceRestricted = await this.serviceAuthorizationCheck(
            checkMarchantVerificationDto.service,
            checkMarchantVerificationDto.merchantID,
          );

          // action autorization
          const isActionRestricted = await this.actionAuthorizationCheck(
            checkMarchantVerificationDto.action,
            checkMarchantVerificationDto.merchantID,
          );

          // transaction limit check
          const isTransactionLimited = await this.transactionLimitCheck(
            checkMarchantVerificationDto.merchantID,
            checkMarchantVerificationDto.amount,
            checkMarchantVerificationDto.currency,
          );

          console.log(
            isBlacklisted,
            isServiceRestricted,
            isActionRestricted,
            isTransactionLimited,
          );
          if (
            isBlacklisted ||
            isServiceRestricted ||
            isActionRestricted ||
            isTransactionLimited
          ) {
            return false;
          }

          // write to kafka
          const topic = existService[0].serviceTopic.toLowerCase();

          console.log(topic);

          this.gatewayClient.emit(topic, {
            merchantID: checkMarchantVerificationDto.merchantID,
            phoneNumber: checkMarchantVerificationDto.phoneNumber,
            amount: checkMarchantVerificationDto.amount,
            currency: checkMarchantVerificationDto.currency,
            service: checkMarchantVerificationDto.service,
            reference: SwyftReference,
            action: checkMarchantVerificationDto.action,
            callbackUrl: checkMarchantVerificationDto.callback_url,
          });

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      console.log("Merchant Not Found");
      return false;
    }

  }

  async checkServiceAndCurrency(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    this.logger.log('Check Merchant');
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

    return { existService, existCurrency };
  }

  async integrityCheck(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
    key: string,
  ) {
    this.logger.log(checkMarchantVerificationDto);
    this.logger.log(key);
    this.logger.log('Check Integrity', checkMarchantVerificationDto, key);

    // const decrypted = decodeURIComponent(
    //   JSON.parse(this.encryptionService.decrypt(key, true)),
    // );
    // delete checkMarchantVerificationDto.key;

    // const isIntegrity = isObjectsEqual(decrypted, checkMarchantVerificationDto);

    return true;
  }

  async blacklistCheck(phone: string) {
    this.logger.log('Check Blacklist');

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
    this.logger.log('Check Service Auth');
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'SERVICE',
      },
    });

    if (params.length === 0) {
      return false;
    }

    const restriction = params.find(
      (e) => e.value.toLowerCase() === service.toLowerCase(),
    );

    if (restriction !== undefined) {
      return false;
    } else {
      return true;
    }
  }

  async actionAuthorizationCheck(action: string, merchantId: string) {
    this.logger.log('Check Action Auth');

    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'ACTION',
      },
    });

    if (params.length === 0) {
      return false;
    }

    const restriction = params.find(
      (e) => e.value.toLowerCase() === action.toLowerCase(),
    );

    if (restriction !== undefined) {
      return false;
    } else {
      return true;
    }
  }

  async transactionLimitCheck(
    merchantId: string,
    amount: number,
    currency: string,
  ) {
    this.logger.log('Check Limit Transaction');

    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'TRANSACTION',
        key: currency === 'CDF' ? 'LIMIT_CDF' : 'LIMIT_USD',
      },
    });

    if (params !== undefined) {
      return false;
    } else {
      if (parseFloat(params[0].value) > amount) {
        return false;
      }
      return true;
    }
  }
}
