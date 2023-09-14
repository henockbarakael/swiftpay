import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountStatusDto } from './dto/create-account-status.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { DatabaseService } from 'shared/database';
import { NOT_FOUND_USER_MESSAGE } from 'libs/constants';

@Injectable()
export class AccountStatusService {
  constructor(private readonly prismaService: DatabaseService) {}
  async create(createAccountStatusDto: CreateAccountStatusDto) {
    try {
      return await this.prismaService.accountStatus.create({
        data: {
          ...createAccountStatusDto,
        },
      });
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  findAll() {
    return `This action returns all accountStatus`;
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.accountStatus.findUnique({
        where: {
          id,
        },
        include: {
          Merchant: true,
          UserSupport: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }

  async update(id: string, updateAccountStatusDto: UpdateAccountStatusDto) {
    try {
      return await this.prismaService.accountStatus.update({
        where: { id },
        data: { ...updateAccountStatusDto },
      });
    } catch (error) {
      throw new NotAcceptableException('error to update');
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.accountStatus.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotAcceptableException('Echec');
    }
  }
}
