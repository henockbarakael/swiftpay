import { Controller, Get } from '@nestjs/common';
import { MerchantCommissionService } from './merchant-commission.service';

@Controller()
export class MerchantCommissionController {
  constructor(private readonly merchantCommission: MerchantCommissionService) {}

  @Get()
  getHello(): string {
    return '{}';
  }
}
