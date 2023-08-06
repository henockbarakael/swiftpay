import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarchantDto } from './dto/create-marchant.dto';
import { UpdateMarchantDto } from './dto/update-marchant.dto';
import { DatabaseService } from 'shared/database';
import { NOT_FOUND_USER_MESSAGE } from 'shared/constants';

@Injectable()
export class MarchantService {
  constructor(private readonly prismaService: DatabaseService){}
  create(createMarchantDto: CreateMarchantDto) {
    return 'This action adds a new marchant';
  }

  async findAll() {
    
      try {
        return  await this.prismaService.merchant.findMany({
        include:{
          user: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true
        },
        skip:{
          
        }
      })
       } catch (error) {
         throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
       }
      }
  

 async  findOne(id: string) {
    try {
      return  await this.prismaService.merchant.findUnique({where:{
        id
      },
      include:{
        user: true,
        accountStatus: true,
        MerchantWallet: true,
        MerchantAccountParameter: true
      }
    })
     } catch (error) {
       throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
     }
    }
  async findByUserId(id:string){
   try {
    return  await this.prismaService.merchant.findMany({where:{
      AND:[
        {
          userId: id
        }
      ]
    },
    include:{
      user: true,
      accountStatus: true,
      MerchantWallet: true,
      MerchantAccountParameter: true
    }
  })[0]
   } catch (error) {
     throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
   }
  }
  update(id: number, updateMarchantDto: UpdateMarchantDto) {
    return `This action updates a #${id} marchant`;
  }

  remove(id: number) {
    return `This action removes a #${id} marchant`;
  }
}
