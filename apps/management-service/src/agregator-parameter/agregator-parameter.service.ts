import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'shared/database';
import { Parameter } from './dto/parameter.dto';

@Injectable()
export class AgregatorParameterService {
  constructor(private readonly dbService: DatabaseService) {}

  async getAllParameter(): Promise<any> {
    const parameters = await this.dbService.agregatorParameter.findMany();
    return parameters;
  }

  async getByType(parameterType: string): Promise<any> {
    const parameters = await this.dbService.agregatorParameter.findMany({
      where: {
        type: parameterType,
      },
    });

    return parameters;
  }

  async getById(id: string): Promise<any> {
    const parameters = await this.dbService.agregatorParameter.findFirst({
      where: {
        id: id,
      },
    });

    return parameters;
  }

  async addEntry(p: Parameter): Promise<any> {
    const response = await this.dbService.agregatorParameter.create({
      data: {
        key: p.key,
        type: p.type,
        value: p.value,
      },
    });

    return response;
  }

  async updateEntry(p: Parameter): Promise<any> {
    const response = await this.dbService.agregatorParameter.update({
      where: {
        id: p.id,
      },
      data: {
        type: p.type,
        key: p.key,
        value: p.value,
      },
    });

    return response;
  }
}
