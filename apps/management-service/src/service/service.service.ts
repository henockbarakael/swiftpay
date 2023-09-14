import {Injectable, NotAcceptableException} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {DatabaseService} from "shared/database";
import {CREATE_TELCO_SERVICE_FAIL_MESSAGE, CREATE_USER_FAIL_MESSAGE} from "../../../../libs/constants";
import {ServiceEntity} from "./entities/service.entity";
import {generateUuid} from "../../../../libs/utils";

@Injectable()
export class ServiceService {
  constructor(private readonly prismaService: DatabaseService) {}
  async  create(createServiceDto: CreateServiceDto):Promise<ServiceEntity> {
    try {
      return await this.prismaService.service.create({
        data:{
          id: generateUuid(),
          ...createServiceDto
        }
      })
    }catch (e) {
      throw new NotAcceptableException(CREATE_TELCO_SERVICE_FAIL_MESSAGE);
    }
  }

  async findAll() {
    try {
      await this.prismaService.service.findMany()
    }
    catch (e) {

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  async  update(id: string, updateServiceDto: UpdateServiceDto):Promise<ServiceEntity> {
    try {
      return await this.prismaService.service.update({
        where{
          id: id,
        },
        data:{
          ...updateServiceDto
        }
      }));
    } catch (error) {
      throw new NotAcceptableException(CREATE_TELCO_SERVICE_FAIL_MESSAGE);
    }
  }

  async remove(id: string):Promise<ServiceEntity> {
    try {
      return await this.prismaService.service.update({
        where: { id },
        data: { deletedAt: new Date(Date.now()) },
      });
    } catch (error) {}
  }
}
