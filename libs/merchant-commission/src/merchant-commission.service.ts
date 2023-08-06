import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { DatabaseService } from 'shared/database';

@Injectable()
export class MerchantCommissionService {

    constructor(private readonly commission: DatabaseService){}

    async getMerchantCommission(merchantId: UUID): Promise<>{

    }

    async updateMerchantCommission(): Promise<>{

    }

    async deleteMerchantCommission(): Promise<>{

    }

    async createMerchantCommission(): Promise<>{

    }
}
