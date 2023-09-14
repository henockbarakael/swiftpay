import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { DatabaseService } from 'shared/database';
import { NOT_FOUND_USER_MESSAGE } from 'libs/constants';

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: DatabaseService) {}
  async create(createCurrencyDto: CreateCurrencyDto) {
    try {
      return await this.prismaService.currency.create({
        data: {
          ...createCurrencyDto,
        },
      });
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  findAll() {
    return `This action returns all currency`;
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.currency.findUnique({
        where: {
          id,
        },
        include: {
          MerchantWallet: true,
          Transaction: true,
          DailyOperation: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
    }
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      return await this.prismaService.accountStatus.update({
        where: { id },
        data: { ...updateCurrencyDto },
      });
    } catch (error) {
      throw new NotAcceptableException('error to update');
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.currency.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotAcceptableException('Echec');
    }
  }
}
