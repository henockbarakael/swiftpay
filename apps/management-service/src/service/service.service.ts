import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DatabaseService } from 'shared/database';
import { CREATE_TELCO_SERVICE_FAIL_MESSAGE } from '../../../../libs/constants';
import { Service } from '@prisma/client';
import { UUID } from 'crypto';

@Injectable()
export class ServiceService {
  constructor(private readonly prismaService: DatabaseService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      return await this.prismaService.service.create({
        data: {
          ...createServiceDto,
        },
      });
    } catch (e) {
      throw new NotAcceptableException(CREATE_TELCO_SERVICE_FAIL_MESSAGE);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.service.findMany();
    } catch (e) {
      throw new NotAcceptableException();
    }
  }

  async findOne(id: UUID) {
    const service = await this.prismaService.service.findUnique({
      where: { id: id },
    });

    return service;
  }

  async remove(id: UUID): Promise<Service> {
    try {
      const response = await this.prismaService.service.delete({
        where: { id },
      });

      return response;
    } catch (error) {}
  }

  async update(id: UUID, updateServiceDto: UpdateServiceDto) {
    try {
      const response = await this.prismaService.service.update({
        data: {
          name: updateServiceDto.name,
          serviceTopic: updateServiceDto.serviceTopic,
        },
        where: { id: id },
      });

      return response;
    } catch (error) {
      throw new NotAcceptableException();
    }
  }
}
