import { Test, TestingModule } from '@nestjs/testing';
import { AccountStatusController } from './account-status.controller';
import { AccountStatusService } from './account-status.service';

describe('AccountStatusController', () => {
  let controller: AccountStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountStatusController],
      providers: [AccountStatusService],
    }).compile();

    controller = module.get<AccountStatusController>(AccountStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
