import { Controller, Get, Delete, Post, Put, Body } from '@nestjs/common';
import { MerchantCommissionService } from './merchant-commission.service';
import { ApiTags } from '@nestjs/swagger';
import { Commission } from './dto/commission.dto';
import { UUID } from 'crypto';
import { UpdateCommission } from './dto/commission-update.dto';

@Controller('merchant-commission')
@ApiTags('merchant-commission')
export class MerchantCommissionController {
  constructor(private readonly merchantCommission: MerchantCommissionService) {}

  @Get()
  async getMerchantCommission(merchantId: UUID): Promise<any> {
    return this.merchantCommission.getMerchantCommission(merchantId);
  }

  @Post()
  async addMercantCommission(@Body() commission: Commission): Promise<any> {
    return this.merchantCommission.createMerchantCommission(commission);
  }

  @Delete()
  async deleteMerchantCommission(@Body() commissionId: UUID): Promise<any> {
    return this.merchantCommission.deleteMerchantCommission(commissionId);
  }

  @Put()
  async updateMerchantCommission(
    @Body() newCommission: UpdateCommission,
  ): Promise<any> {
    return this.updateMerchantCommission(newCommission);
  }
}
