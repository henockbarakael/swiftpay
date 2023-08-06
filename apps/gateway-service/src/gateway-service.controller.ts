import { Controller, Post } from '@nestjs/common';
import { GatewayServiceService } from './gateway-service.service';

@Controller()
export class GatewayServiceController {
  constructor(private readonly gatewayServiceService: GatewayServiceService) {}

  @Post()
  gateway() {
    return this.gatewayServiceService.getHello();
  }
}
