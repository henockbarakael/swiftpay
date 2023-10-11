import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UpdateCommission } from '../dto/commission-update.dto';
import { DatabaseService } from 'shared/database';
import { Commission } from '../dto/commission.dto';

@Injectable()
export class MerchantCommissionService {
  constructor(private readonly commission: DatabaseService) {}

  async getMerchantCommission(merchantId: UUID): Promise<Commission> {
    const commissions = await this.commission.merchantCommission.findUnique({
      where: { id: merchantId },
    });
    return commissions;
  }

  async updateMerchantCommission(
    newCommission: UpdateCommission,
  ): Promise<any> {
    const response = await this.commission.merchantCommission.update({
      data: {
        commission: newCommission.commission,
        action: newCommission.action,
        serviceId: newCommission.serviceId,
      },
      where: {
        id: newCommission.id,
      },
    });

    return response;
  }

  async deleteMerchantCommission(commissionId: UUID): Promise<any> {
    const response = await this.commission.merchantCommission.delete({
      where: {
        id: commissionId,
      },
    });
    return response;
  }

  async createMerchantCommission(
    commission: Commission,
  ): Promise<Commission | any> {
    const response = await this.commission.merchantCommission.create({
      data: {
        serviceId: commission.serviceId,
        action: commission.action.toString(),
        commission: commission.commission,
      },
    });

    return response;
  }
}
