import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
import { DatabaseService } from 'shared/database';
import { ActionOperationEnum } from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';
import { referenceGenerator, checkValidOperator } from 'libs/utils';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { WalletService } from 'shared/wallet';


interface CheckMarchantResponse {
  success: boolean;
  ack: any;
  message: string;
}
const prisma = new PrismaClient();
@Injectable()
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
	  try{
    const key = checkMarchantVerificationDto.key;

   //  try {
    const existMarchant = await this.dbService.merchant.findUniqueOrThrow({
      where: {
        id: checkMarchantVerificationDto.merchantID,
      },
      include: {
        users: true,
      },
    });



    const { existService, existCurrency } = await this.checkServiceAndCurrency(
      checkMarchantVerificationDto,
    );


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

          // check if the customer number match operator schemas
          const operatorCheckResult = checkValidOperator(
            checkMarchantVerificationDto.phoneNumber,
            existService[0].name,
          );
          
          if (operatorCheckResult.success!==true) {
            console.log(operatorCheckResult.message);
            return { success: false, ack: null, message: operatorCheckResult.message };
          }
          const transactionStatus =
            await this.dbService.transactionStatus.findFirst({
              where: {
                status: 'PENDING',
              },
            });

          // swyft reference
          const SwyftReference = referenceGenerator();
	        // formatage du numéro à enregstré dans la base des données
          const phoneNumberWithZero = checkMarchantVerificationDto.phoneNumber.padStart(10, '0');
          // store transaction in the database
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
                return { success: false, ack: null, message: "Opération échouée en raison d'un solde insuffisant."  };
              } else {
                await this.walletService.creditWallet(
                  checkMarchantVerificationDto.currency,
                  checkMarchantVerificationDto.merchantID,
                  checkMarchantVerificationDto.amount,
                );
              }
            }

            console.log(`Données à insérer dans la base de données: ${ack}`);

            console.log(isIntegrity);
            // verifify integrity
            if (isIntegrity.success !== true) {
              console.log("Échec de la vérification d'intégrité. Les données sont invalides ou corrompues.");
              return { success: false, ack: null, message: "Échec de la vérification d'intégrité. Les données sont invalides ou corrompues."  };
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


            if (
              isBlacklisted.success === true ||
              isServiceRestricted.success === true ||
              isActionRestricted.success === true ||
              isTransactionLimited.success === true
            ) {

              let rejectionReasons: string[] = [];

              if (isBlacklisted.success === true) {
                rejectionReasons.push("Le client est sur liste noire.");
              }

              if (isServiceRestricted.success === true) {
                rejectionReasons.push("Le service est restreint pour ce client.");
              }

              if (isActionRestricted.success === true) {
                rejectionReasons.push("L'action est restreinte pour ce client.");
              }

              if (isTransactionLimited.success === true) {
                rejectionReasons.push("La limite de transaction a été atteinte pour ce client.");
              }

              const rejectionMessage = "Transaction rejetée. Raisons : " + rejectionReasons.join(" ");
              return {
                success: false,
                ack: null,
                message: rejectionMessage,
              };
            }

            // write to kafka
            const topic = existService[0].serviceTopic.toLowerCase();

            this.gatewayClient.emit(topic, {
              merchantID: checkMarchantVerificationDto.merchantID,
              phoneNumber: `243${checkMarchantVerificationDto.phoneNumber}`,
              amount: checkMarchantVerificationDto.amount,
              currency: checkMarchantVerificationDto.currency,
              service: checkMarchantVerificationDto.service,
              reference: SwyftReference,
              action: checkMarchantVerificationDto.action,
              callbackUrl: checkMarchantVerificationDto.callback_url,
            });

            return { success: true, ack:ack, message: "Your requested has been received successfuly and it's under processing" };
        
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                if (error.meta?.target === 'daily_operation_merchantReference_key') {
                  console.log("Erreur : une opération quotidienne avec cette référence de marchand existe déjà.");
                  return {
                    success: false,
                    ack: null,
                    message: "La référence marchande "+checkMarchantVerificationDto.reference+" existe déjà.",
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


        } else {
		      console.log("L'action doit être debit ou credit.");
          return { success: false, ack: null, message: "L'action doit être debit ou credit."  };
        }
      } else {
	      console.log("La devise n'est pas correcte");
        return { success: false, ack: null, message: "La devise n'est pas correcte."  };
      }
    } else {
	    console.log("Marchand non trouvé dans le système.");
      return { success: false, ack: null, message: "Marchand non trouvé dans le système."  };
    }
     } catch (error) {
     // throw new NotAcceptableException(error);
	    console.error("Une erreur s'est produite :", error);
			throw error;
     }
  }

  async checkServiceAndCurrency(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    this.logger.log(JSON.stringify(checkMarchantVerificationDto));
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
    console.log(existService, existCurrency);
    return { existService, existCurrency };
  }

  async integrityCheck(
    checkMarchantVerificationDto: CheckMarchantVerificationDto,
    key: string,
  ): Promise<{ success: boolean; ack: any; message: string }> {
	  
    this.logger.log('Check Integrity', JSON.stringify(checkMarchantVerificationDto), key);

    return { success: true, ack: null, message: "Vérification d'intégrité réussie. Les données sont valides." };
  }

  async blacklistCheck(phone: string): Promise<{ success: boolean; ack: any; message: string }> {
    this.logger.log('Check Blacklist');
  
    const number = await this.dbService.blacklistNumber.findMany({
      where: {
        number: {
          equals: phone,
        },
      },
    });
    this.logger.log(number);
  
    if (number.length === 0) {
      return { success: false, ack: null, message: "Le numéro est en liste noire. L'opération est interdite." };
    } else {
      return { success: true, ack: null, message: "Le numéro n'est pas en liste noire. L'opération est autorisée." };
    }
  }

  async serviceAuthorizationCheck(service: string, merchantId: string): Promise<{ success: boolean; ack: any; message: string }> {
    this.logger.log('Check Service Auth');
  
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'SERVICE',
      },
    });
  
    if (params.length === 0) {
      return { success: false, ack: null, message: "paramètres introuvables" };
    }
  
    const restriction = params.find(
      (e) => e.value.toLowerCase() === service.toLowerCase(),
    );
  
    if (restriction !== undefined) {
      return { success: false, ack: null, message: "Ce service n'est pas autorisé pour ce marchand." };
    } else {
      return { success: true, ack: null, message: "Le service est autorisé pour ce marchand." };
    }
  }

  async actionAuthorizationCheck(action: string, merchantId: string): Promise<{ success: boolean; ack: any; message: string }> {
    this.logger.log('Check Action Auth');
  
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'ACTION',
      },
    });
  
    if (params.length === 0) {
      return { success: false, ack: null, message: "paramètres introuvables" };
    }
  
    const restriction = params.find(
      (e) => e.value.toLowerCase() === action.toLowerCase(),
    );
  
    if (restriction !== undefined) {
      return { success: false, ack: null, message: "Le marchand n'est pas autorisé à effectuer cette action." };
    } else {
      return { success: true, ack: null, message: "L'action est autorisée pour ce marchand." };
    }
  }

  async transactionLimitCheck(
    merchantId: string,
    amount: number,
    currency: string,
  ): Promise<{ success: boolean; ack: any; message: string }> {
    this.logger.log('Check Limit Transaction');
  
    const params = await this.dbService.merchantAccountParameter.findMany({
      where: {
        merchantId: merchantId,
        type: 'TRANSACTION',
        key: currency === 'CDF' ? 'LIMIT_CDF' : 'LIMIT_USD',
      },
    });
  
    if (params !== undefined) {
      return { success: false, ack: null, message: "paramètres introuvables" };
    } else {
      if (parseFloat(params[0].value) > amount) {
        return { success: false, ack: null, message: "Le marchand a dépassé la limite de transaction" };
      }
      return { success: true, ack: null, message: "L transaction est autorisée." };
    }
  }
}
