import {Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import {DatabaseService} from "shared/database";
import {CREATE_USER_FAIL_MESSAGE, NOT_FOUND_USER_MESSAGE} from "../../../../libs/constants";
import {MerchantEntity} from "./entities/merchant.entity";

@Injectable()
export class MerchantService {
  constructor(private readonly prismaService: DatabaseService) {}
  async create(createMerchantDto: CreateMerchantDto):Promise<MerchantEntity> {
    try {
      const [user, accountStatus, institution] = await Promise.all([
        await this.prismaService.user.findUniqueOrThrow({
          where: {
            id: createMerchantDto.userId,
          },
        }),
        await this.prismaService.accountStatus.findUniqueOrThrow({
          where: {
            id: createMerchantDto.accountStatusId,
          },
        }),
        await this.prismaService.institution.findUniqueOrThrow({
          where: {
            id: createMerchantDto.institutionId,
          },
        }),
      ]);
      return await this.prismaService.merchant.create({
        data: {
          userId: user.id,
          accountStatusId: accountStatus.id,
          institutionId: institution.id,
        },
      });
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async findOne(id: string):Promise<MerchantEntity> {
    try {
      return await this.prismaService.merchant.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }
  async findByUserId(id: string):Promise<MerchantEntity> {
    try {
      return await this.prismaService.merchant.findMany({
        where: {
          AND: [
            {
              userId: id,
            },
          ],
        },
        include: {
          user: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true,
        },
      })[0];
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }
  async update(id: string, updateMerchantDto: UpdateMerchantDto):Promise<MerchantEntity> {
    try {
      return await this.prismaService.merchant.update({
        where: { id },
        data: { ...updateMerchantDto },
      });
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async remove(id: string):Promise<MerchantEntity> {
    try {
      return await this.prismaService.merchant.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) {}
  }
}
