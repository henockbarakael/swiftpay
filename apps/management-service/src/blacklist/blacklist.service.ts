import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { UpdateBlacklistDto } from './dto/update-blacklist.dto';
import { DatabaseService } from 'shared/database';
import {
  CREATE_BLACK_LIST_FAIL_MESSAGE,
  CREATE_BLACK_LIST_NOTFOUND_MESSAGE,
  DELETE_BLACK_LIST_FAIL_MESSAGE,
  UPDATE_BLACK_LIST_FAIL_MESSAGE,
} from 'libs/constants';

@Injectable()
export class BlacklistService {
  constructor(private readonly prismaService: DatabaseService) {}

  async create(createBlacklistDto: CreateBlacklistDto) {
    try {
      return await this.prismaService.blacklistNumber.create({
        data: {
          ...createBlacklistDto,
        },
      });
    } catch (e) {
      throw new NotAcceptableException(CREATE_BLACK_LIST_FAIL_MESSAGE);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.blacklistNumber.findMany();
    } catch (e) {
      throw new NotFoundException(CREATE_BLACK_LIST_NOTFOUND_MESSAGE);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.blacklistNumber.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new NotFoundException(CREATE_BLACK_LIST_NOTFOUND_MESSAGE);
    }
  }

  async update(id: string, updateBlacklistDto: UpdateBlacklistDto) {
    try {
      return await this.prismaService.service.update({
        where: { id },
        data: { ...updateBlacklistDto },
      });
    } catch (error) {
      throw new NotAcceptableException(UPDATE_BLACK_LIST_FAIL_MESSAGE);
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.service.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotAcceptableException(DELETE_BLACK_LIST_FAIL_MESSAGE);
    }
  }
}
