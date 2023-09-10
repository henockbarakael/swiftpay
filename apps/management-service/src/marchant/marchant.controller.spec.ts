import { Test, TestingModule } from '@nestjs/testing';
import { MarchantController } from './marchant.controller';
import { MarchantService } from './marchant.service';

describe('MarchantController', () => {
  let controller: MarchantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarchantController],
      providers: [MarchantService],
    }).compile();

    controller = module.get<MarchantController>(MarchantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
