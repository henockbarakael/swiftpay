import { Controller, Get } from '@nestjs/common';
import { TelcoServiceService } from './telco-service.service';

@Controller()
export class TelcoServiceController {
  constructor(private readonly telcoServiceService: TelcoServiceService) {}

  @Get()
  getHello(): string {
    return this.telcoServiceService.getHello();
  }
}
