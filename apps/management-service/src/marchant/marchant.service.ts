import { Injectable } from '@nestjs/common';
import { CreateMarchantDto } from './dto/create-marchant.dto';
import { UpdateMarchantDto } from './dto/update-marchant.dto';

@Injectable()
export class MarchantService {
  create(createMarchantDto: CreateMarchantDto) {
    return 'This action adds a new marchant';
  }

  findAll() {
    return `This action returns all marchant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marchant`;
  }

  update(id: number, updateMarchantDto: UpdateMarchantDto) {
    return `This action updates a #${id} marchant`;
  }

  remove(id: number) {
    return `This action removes a #${id} marchant`;
  }
}
