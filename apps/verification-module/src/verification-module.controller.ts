import { Controller, Get } from '@nestjs/common';
import { VerificationModuleService } from './verification-module.service';

@Controller()
export class VerificationModuleController {
  constructor(private readonly verificationModuleService: VerificationModuleService) {}

  @Get()
  getHello(): string {
    return this.verificationModuleService.getHello();
  }
}
