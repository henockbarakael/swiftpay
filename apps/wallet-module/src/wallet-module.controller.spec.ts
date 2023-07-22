import { Test, TestingModule } from '@nestjs/testing';
import { WalletModuleController } from './wallet-module.controller';
import { WalletModuleService } from './wallet-module.service';

describe('WalletModuleController', () => {
  let walletModuleController: WalletModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletModuleController],
      providers: [WalletModuleService],
    }).compile();

    walletModuleController = app.get<WalletModuleController>(WalletModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(walletModuleController.getHello()).toBe('Hello World!');
    });
  });
});
