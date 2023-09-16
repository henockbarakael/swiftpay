import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { DatabaseService } from 'shared/database';
import {
  CREATE_USER_FAIL_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
} from '../../../../libs/constants';
import { PaginationDto } from 'shared/dto';
import { generateUuid } from '../../../../libs/utils';
import { Merchant } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(private readonly prismaService: DatabaseService) {}
  async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
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

      // create du merchant
      const merchant = await this.prismaService.merchant.create({
        data: {
          userId: user.id,
          accountStatusId: accountStatus.id,
          institutionId: institution.id,
        },
        include: {
          accountStatus: true,
          MerchantAccountParameter: true,
          user: true,
          institution: true,
        },
      });

      // creation des wallets pour le merchant
      const services = await this.prismaService.service.findMany();
      const currencies = await this.prismaService.currency.findMany();

      for (let index = 0; index < services.length; index++) {
        for (let index2 = 0; index2 < currencies.length; index2++) {
          const currency = currencies[index2];

          await this.prismaService.merchantWallet.createMany({
            data: [
              {
                serviceId: services[index].id,
                merchantId: merchant.id,
                balance: 0,
                currencyId: currency.id,
              },
            ],
          });
        }
      }

      return merchant;
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async findOne(id: string): Promise<Merchant> {
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
  async findByUserId(id: string): Promise<Merchant> {
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
  async update(
    id: string,
    updateMerchantDto: UpdateMerchantDto,
  ): Promise<Merchant> {
    try {
      return await this.prismaService.merchant.update({
        where: { id },
        data: { ...updateMerchantDto },
      });
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async remove(id: string): Promise<Merchant> {
    try {
      return await this.prismaService.merchant.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) {}
  }

  async findAll(paginationDto: PaginationDto): Promise<Merchant> {
    try {
      return await this.prismaService.merchant.findMany({
        include: {
          user: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true,
        },
        skip: parseInt(paginationDto.page.toString()),
        take: parseInt(paginationDto.limit.toString()),
      })[0];
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }
}
