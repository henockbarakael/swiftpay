import { Controller, Post } from '@nestjs/common';
import { GatewayServiceService } from './gateway-service.service';

@Controller()
export class GatewayServiceController {
  constructor(private readonly gatewayServiceService: GatewayServiceService) {}

  @Post()
  gateway(data : any) {
    return this.gatewayServiceService.processRequest(data);
  }
}
