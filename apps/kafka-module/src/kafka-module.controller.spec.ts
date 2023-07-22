import { Test, TestingModule } from '@nestjs/testing';
import { KafkaModuleController } from './kafka-module.controller';
import { KafkaModuleService } from './kafka-module.service';

describe('KafkaModuleController', () => {
  let kafkaModuleController: KafkaModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KafkaModuleController],
      providers: [KafkaModuleService],
    }).compile();

    kafkaModuleController = app.get<KafkaModuleController>(KafkaModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(kafkaModuleController.getHello()).toBe('Hello World!');
    });
  });
});
