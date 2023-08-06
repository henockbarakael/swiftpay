import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { DatabaseService } from 'shared/database';
import { CREATE_USER_FAIL_MESSAGE, NOT_FOUND_USER_MESSAGE } from 'shared/constants';

@Injectable()
export class InstitutionService {
  constructor(private readonly prismaService: DatabaseService) { }
  async findAll() {
    try {
      return await this.prismaService.institution.findMany({
        include: {
          Marchant: true,
        },
      })
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
    }
  }

  async create(createInstitutionDto: CreateInstitutionDto) {
    try {

      return await this.prismaService.institution.create({
        data: {
          ...createInstitutionDto
        }
      })
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE)
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.institution.findUnique({
        where: {
          id
        },
        include: {
          Marchant: true,
        }
      })
    } catch (error) {
      throw new NotFoundException(NOT_FOUND_USER_MESSAGE)
    }
  }

  async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    try {
      return await this.prismaService.institution.update({ where: { id }, data: { ...updateInstitutionDto } })
    } catch (error) {
      throw new NotAcceptableException(CREATE_USER_FAIL_MESSAGE)
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.institution.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) { }
  }
}
