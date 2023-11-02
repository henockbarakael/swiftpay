import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSupportDto } from './dto/create-user-support.dto';
import { UpdateUserSupportDto } from './dto/update-user-support.dto';
import { DatabaseService } from 'shared/database';
import {
  CREATE_USER_FAIL_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
} from 'libs/constants';
import { generateUuid } from '../../../../libs/utils';

@Injectable()
export class UserSupportService {
  constructor(private readonly prismaService: DatabaseService) {}
  async create(createUserSupportDto: CreateUserSupportDto) {
    try {
      const [user, accountStatus] = await Promise.all([
        await this.prismaService.user.findUniqueOrThrow({
          where: {
            id: createUserSupportDto.userId,
          },
        }),
        await this.prismaService.accountStatus.findUniqueOrThrow({
          where: {
            id: createUserSupportDto.accountStatusId,
          },
        }),
      ]);
      return await this.prismaService.userSupport.create({
        data: {
          id: generateUuid(),
          userId: user.id,
          accountStatusId: accountStatus.id,
        },
      });
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.userSupport.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          accountStatus: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }
  async findByUserId(id: string) {
    try {
      return await this.prismaService.merchant.findMany({
        where: {
          AND: [
            {
              id: id,
            },
          ],
        },
        include: {
          users: true,
          accountStatus: true,
          MerchantWallet: true,
          MerchantAccountParameter: true,
        },
      })[0];
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }
  async update(id: string, updateUserSupportDto: UpdateUserSupportDto) {
    try {
      return await this.prismaService.userSupport.update({
        where: { id },
        data: { ...updateUserSupportDto },
      });
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE);
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.userSupport.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) {}
  }
}
