import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway-service.controller';
import { GatewayService } from './gateway-service.service';

describe('VerificationController', () => {
  let controller: GatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
