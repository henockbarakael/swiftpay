import { Controller, Get } from '@nestjs/common';
import { ManagementServiceService } from './management-service.service';

@Controller()
export class ManagementServiceController {
  constructor(
    private readonly managementServiceService: ManagementServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.managementServiceService.getHello();
  }
}
