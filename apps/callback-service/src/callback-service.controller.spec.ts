import { Test, TestingModule } from '@nestjs/testing';
import { CallbackServiceController } from './callback-service.controller';
import { CallbackServiceService } from './callback-service.service';

describe('CallbackServiceController', () => {
  let callbackServiceController: CallbackServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CallbackServiceController],
      providers: [CallbackServiceService],
    }).compile();

    callbackServiceController = app.get<CallbackServiceController>(
      CallbackServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(callbackServiceController.getHello()).toBe('Hello World!');
    });
  });
});
