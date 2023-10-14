import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AgregatorParameterService } from './agregator-parameter.service';
import { Parameter } from './dto/parameter.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('agregator-parameter')
@ApiTags('agregator-parameter')
export class AgregatorParameterController {
  constructor(
    private readonly agregatorParameterService: AgregatorParameterService,
  ) {}

  @Get()
  async getParameter(): Promise<any> {
    return await this.agregatorParameterService.getAllParameter();
  }

  @Post('/type')
  async getParameterByType(@Body() type: string): Promise<any> {
    return await this.agregatorParameterService.getByType(type);
  }

  @Post('/id')
  async getParameterById(@Body() id: string): Promise<any> {
    return await this.agregatorParameterService.getById(id);
  }

  @Post()
  async addParameter(@Body() parameter: Parameter): Promise<any> {
    return await this.agregatorParameterService.addEntry(parameter);
  }

  @Put('/update')
  async updateParameter(@Body() parameter: Parameter): Promise<any> {
    return await this.agregatorParameterService.updateEntry(parameter);
  }
}
