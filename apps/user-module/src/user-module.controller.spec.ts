import { Test, TestingModule } from '@nestjs/testing';
import { UserModuleController } from './user-module.controller';
import { UserModuleService } from './user-module.service';

describe('UserModuleController', () => {
  let userModuleController: UserModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserModuleController],
      providers: [UserModuleService],
    }).compile();

    userModuleController = app.get<UserModuleController>(UserModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userModuleController.getHello()).toBe('Hello World!');
    });
  });
});
