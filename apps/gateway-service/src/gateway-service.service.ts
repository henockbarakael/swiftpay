import { Inject, Injectable, Logger } from '@nestjs/common';
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
export class GatewayService {
  constructor(
    private dbService: DatabaseService,
    @Inject('gateway') private gatewayClient: ClientKafka,
    private encryptionService: EncryptionService,
  ) {}

  private readonly logger = new Logger(GatewayService.name);

  async checkMarchant(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    const key = checkMarchantVerificationDto.key;

    // try {
    const existMarchant = await this.dbService.merchant.findUniqueOrThrow({
      where: {
        id: checkMarchantVerificationDto.merchantID,
      },
      include: {
        user: true,
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
          if (
            !checkValidOperator(
              checkMarchantVerificationDto.phoneNumber,
              existService[0].name,
            )
          ) {
            return false;
          }

          console.log('before db write');
          // store transaction in the database
          const ack = await this.dbService.dailyOperation.create({
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
              customerNumber: checkMarchantVerificationDto.phoneNumber,
            },
          });

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
          const topic = existService[0].name.toLowerCase();

          console.log(topic);

          await this.gatewayClient.emit(topic, {
            merchantID: checkMarchantVerificationDto.merchantID,
            phoneNumber: checkMarchantVerificationDto.phoneNumber,
            amount: checkMarchantVerificationDto.amount,
            currency: checkMarchantVerificationDto.currency,
            service: checkMarchantVerificationDto.service,
            reference: checkMarchantVerificationDto.reference,
            action: checkMarchantVerificationDto.action,
          });

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
    // } catch (error) {
    //   throw new NotAcceptableException(error);
    // }
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
    this.logger.log('Check Integrity');

    const decrypted = decodeURIComponent(
      JSON.parse(this.encryptionService.decrypt(key, true)),
    );
    delete checkMarchantVerificationDto.key;

    const isIntegrity = isObjectsEqual(decrypted, checkMarchantVerificationDto);

    return isIntegrity;
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

    const restriction = params.find(
      (e) => e.value.toLowerCase() === service.toLowerCase(),
    );

    if (restriction !== undefined) {
      return false;
    }
    return true;
  }

  async actionAuthorizationCheck(action: string, merchantId: string) {
    this.logger.log('Check Action Auth');

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
      return false;
    }
    return true;
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

    if (parseFloat(params[0].value) > amount) {
      return false;
    }
    return true;
  }
}
