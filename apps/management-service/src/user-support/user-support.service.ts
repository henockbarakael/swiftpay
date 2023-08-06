import { Injectable } from '@nestjs/common';
import { CreateUserSupportDto } from './dto/create-user-support.dto';
import { UpdateUserSupportDto } from './dto/update-user-support.dto';

@Injectable()
export class UserSupportService {
  create(createUserSupportDto: CreateUserSupportDto) {
    return 'This action adds a new userSupport';
  }

  findAll() {
    return `This action returns all userSupport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSupport`;
  }

  update(id: number, updateUserSupportDto: UpdateUserSupportDto) {
    return `This action updates a #${id} userSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSupport`;
  }
}
