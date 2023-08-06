
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateMarchantDto } from './dto/create-marchant.dto';
import { UpdateMarchantDto } from './dto/update-marchant.dto';
import { DatabaseService } from 'shared/database';
import { CREATE_USER_FAIL_MESSAGE, NOT_FOUND_USER_MESSAGE } from 'shared/constants';
import { PaginationDto } from 'shared/dto';

@Injectable()
export class MarchantService {
  constructor(private readonly prismaService: DatabaseService) { }
  async create(createMarchantDto: CreateMarchantDto) {
    try {
      const [user, accountStatus, institution] = await Promise.all([
        await this.prismaService.user.findUniqueOrThrow({
          where: {
            id: createMarchantDto.userId
          }
        }),
        await this.prismaService.accountStatus.findUniqueOrThrow({
          where: {
            id: createMarchantDto.accountStatusId
          }
        }),
        await this.prismaService.institution.findUniqueOrThrow({
          where: {
            id: createMarchantDto.institutionId
          }
        })
      ])
      return await this.prismaService.merchant.create({
        data: {
          userId: user.id,
          accountStatusId: accountStatus.id,
          institutionId: institution.id
        }
      })
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE)
    }
  }

  async findAll(pagination: PaginationDto) {
    const offSet = (pagination.page - 1) * pagination.limit;
    try {
      return await this.prismaService.merchant.findMany({
        include: {
          user: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true
        },
        skip: offSet,
        take: pagination.limit
      })
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
    }
  }


  async findOne(id: string) {
    try {
      return await this.prismaService.merchant.findUnique({
        where: {
          id
        },
        include: {
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
  async findByUserId(id: string) {
    try {
      return await this.prismaService.merchant.findMany({
        where: {
          AND: [
            {
              userId: id
            }
          ]
        },
        include: {
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
  async update(id: string, updateMarchantDto: UpdateMarchantDto) {
    try {
      return await this.prismaService.merchant.update({where:{id},data:{...updateMarchantDto}})
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE)
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.merchant.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) {}
  }
}
