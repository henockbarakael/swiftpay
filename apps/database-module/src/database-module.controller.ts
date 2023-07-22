import { Controller, Get } from '@nestjs/common';
import { DatabaseModuleService } from './database-module.service';

@Controller()
export class DatabaseModuleController {
  constructor(private readonly databaseModuleService: DatabaseModuleService) {}

  @Get()
  getHello(): string {
    return this.databaseModuleService.getHello();
  }
}
