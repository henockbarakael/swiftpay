import { Test, TestingModule } from '@nestjs/testing';
import { MarchantService } from './marchant.service';

describe('MarchantService', () => {
  let service: MarchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarchantService],
    }).compile();

    service = module.get<MarchantService>(MarchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
