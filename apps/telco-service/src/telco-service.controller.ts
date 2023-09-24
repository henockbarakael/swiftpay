import { Controller, Get } from '@nestjs/common';
import { TelcoServiceService } from './telco-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class TelcoServiceController {
  constructor(private readonly telcoServiceService: TelcoServiceService) {}

  @EventPattern('vodacom')
  handleVodacomRequest(data: any) {
    console.log(data);
    this.telcoServiceService.handleTelcoRequest(data.value);
  }

  @EventPattern('airtel')
  handleAirtelRequest(data: any) {
    console.log(data);
    this.telcoServiceService.handleTelcoRequest(data.value);
  }

  @EventPattern('orange')
  handleOrangeRequest(data: any) {
    console.log(data);
    this.telcoServiceService.handleTelcoRequest(data.value);
  }
}
