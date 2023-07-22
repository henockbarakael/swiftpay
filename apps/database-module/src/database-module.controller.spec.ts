import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModuleController } from './database-module.controller';
import { DatabaseModuleService } from './database-module.service';

describe('DatabaseModuleController', () => {
  let databaseModuleController: DatabaseModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseModuleController],
      providers: [DatabaseModuleService],
    }).compile();

    databaseModuleController = app.get<DatabaseModuleController>(DatabaseModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(databaseModuleController.getHello()).toBe('Hello World!');
    });
  });
});
