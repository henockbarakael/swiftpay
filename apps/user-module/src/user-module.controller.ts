import { Controller, Get } from '@nestjs/common';
import { UserModuleService } from './user-module.service';

@Controller()
export class UserModuleController {
  constructor(private readonly userModuleService: UserModuleService) {}

  @Get()
  getHello(): string {
    return this.userModuleService.getHello();
  }
}
