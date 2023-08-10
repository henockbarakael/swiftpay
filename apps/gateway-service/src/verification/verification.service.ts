
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CheckMarchantVerificationDto, CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { DatabaseService } from 'shared/database';
import { ActionOperationEnum } from '@prisma/client';
import * as NodeRSA from 'node-rsa';
import { isObjectsEqual } from 'libs/utils';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class VerificationService {
  constructor(private dbService: DatabaseService, @Inject('NOTIFICATION_SERVICE') private notificationService: ClientKafka) { }
  async checkMarchant(checkMarchantVerificationDto: CheckMarchantVerificationDto) {
    const key = checkMarchantVerificationDto.key
    let wallet = null
    // check marchant ID
    const rsa = new NodeRSA({ b: 512 })


    try {
      const existMarchant = await this.dbService.merchant.findUniqueOrThrow({
        where: {
          id: checkMarchantVerificationDto.machantID
        },
        include:{
          user: true,
        }
      })
      if (Object.keys(existMarchant).length !== 0) {
        const [existService, existCurrency] = await Promise.all([

          // check service
          await this.dbService.service.findMany({
            where: {
              AND: [
                {
                  name: checkMarchantVerificationDto.service
                }
              ]
            }
          }),

          await this.dbService.currency.findMany({
            where: {
              AND: [
                {
                  currency: checkMarchantVerificationDto.currency
                }
              ]
            }
          }),



        ])
        if (existService.length !== 0 && existCurrency.length !== 0) {
          if (checkMarchantVerificationDto.action === ActionOperationEnum.DEBIT
            || checkMarchantVerificationDto.action === ActionOperationEnum.CREDIT) {

            const decrypted = decodeURIComponent(JSON.parse(rsa.decrypt(key, 'utf8').toString()))
            delete checkMarchantVerificationDto.key
            const isIntegrity = isObjectsEqual(decrypted, checkMarchantVerificationDto)

            // verifify integrity
            if (isIntegrity) {
              wallet = await this.dbService.merchantWallet.findMany({
                where: {
                  AND: [
                    {
                      merchantId: existMarchant.id
                    },
                    {
                      balance: checkMarchantVerificationDto.amount
                    },
                  ]
                }
              })
              this.notificationService.send('send-wallet-verification', JSON.stringify({
                to: existMarchant.user.email,
                marchant: existMarchant.user,
              }),)
              return wallet
            }

          }
        }
      }

    } catch (error) {
      throw new NotAcceptableException("Impossible de valider votre verifaction")
    }
  }
  create(createVerificationDto: CreateVerificationDto) {
    return 'This action adds a new verification';
  }

  findAll() {
    return `This action returns all verification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verification`;
  }

  update(id: number, updateVerificationDto: UpdateVerificationDto) {
    return `This action updates a #${id} verification`;
  }

  remove(id: number) {
    return `This action removes a #${id} verification`;
  }
}
