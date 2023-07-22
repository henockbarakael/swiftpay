import { Test, TestingModule } from '@nestjs/testing';
import { VerificationModuleController } from './verification-module.controller';
import { VerificationModuleService } from './verification-module.service';

describe('VerificationModuleController', () => {
  let verificationModuleController: VerificationModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VerificationModuleController],
      providers: [VerificationModuleService],
    }).compile();

    verificationModuleController = app.get<VerificationModuleController>(VerificationModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(verificationModuleController.getHello()).toBe('Hello World!');
    });
  });
});
