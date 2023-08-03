import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CheckMarchantVerificationDto, CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { DatabaseService } from 'shared/database';
import { ActionOperationEnum } from '@prisma/client';
import * as NodeRSA from 'node-rsa';
@Injectable()
export class VerificationService {
  constructor(private dbService: DatabaseService, private jwtService: JwtService){}
  async checkMarchant(checkMarchantVerificationDto: CheckMarchantVerificationDto) {
    const keyDecoded = checkMarchantVerificationDto.key
    let wallet = null
    // check marchant ID
    const key = new NodeRSA({b: 512})
    key.decrypt(keyDecoded)

    try {
      const [existMarchant,existService, existCurrency] = await Promise.all([
        await this.dbService.merchant.findUnique({
          where:{
            id: checkMarchantVerificationDto.machantID
          }
        }),
          // check service
          await this.dbService.service.findMany({
            where:{
             AND:[
              {
                name: checkMarchantVerificationDto.service
              }
             ]
            }
          }),

          await this.dbService.currency.findMany({
            where:{
             AND:[
              {
                currency: checkMarchantVerificationDto.currency
              }
             ]
            }
          }),

        
        
      ])
      if (Object.keys(existMarchant).length !== 0 && existService.length !== 0 && existCurrency.length!== 0) {
         if (checkMarchantVerificationDto.action === ActionOperationEnum.DEBIT 
          || checkMarchantVerificationDto.action=== ActionOperationEnum.CREDIT) {
            wallet = await this.dbService.merchantWallet.findMany({
              where:{
                AND:[
                  {
                    merchantId: existMarchant.id
                  },
                  {
                    balance: checkMarchantVerificationDto.amount
                  },
                ]
              }
            })
            return wallet
         }
      }
    } catch (error) {
      
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
