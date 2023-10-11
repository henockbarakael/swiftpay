import { Test, TestingModule } from '@nestjs/testing';
import { MerchantCommissionService } from './merchant-commission.service';

describe('MerchantCommissionService', () => {
  let service: MerchantCommissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantCommissionService],
    }).compile();

    service = module.get<MerchantCommissionService>(MerchantCommissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
