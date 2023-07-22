import { Test, TestingModule } from '@nestjs/testing';
import { TelcoServiceController } from './telco-service.controller';
import { TelcoServiceService } from './telco-service.service';

describe('TelcoServiceController', () => {
  let telcoServiceController: TelcoServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TelcoServiceController],
      providers: [TelcoServiceService],
    }).compile();

    telcoServiceController = app.get<TelcoServiceController>(
      TelcoServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(telcoServiceController.getHello()).toBe('Hello World!');
    });
  });
});
