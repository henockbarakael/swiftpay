import { Controller, Get } from '@nestjs/common';
import { TelcoServiceService } from './telco-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class TelcoServiceController {
  constructor(private readonly telcoServiceService: TelcoServiceService) {}

  @EventPattern('vodacom')
  handleVodacomRequest(data: any) {
    this.telcoServiceService.handleTelcoRequest(data);
  }

  @EventPattern('airtel')
  handleAirtelRequest(data: any) {
    console.log(data);
    this.telcoServiceService.handleTelcoRequest(data);
  }

  @EventPattern('orange')
  handleOrangeRequest(data: any) {
    console.log(data);
    this.telcoServiceService.handleTelcoRequest(data);
  }
}
