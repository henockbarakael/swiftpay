import { Controller, Get } from '@nestjs/common';
import { TelcoServiceService } from './telco-service.service';
import { EventPattern } from '@nestjs/microservices';
import { Request } from 'shared/types/request.type';

@Controller()
export class TelcoServiceController {
  constructor(private readonly telcoServiceService: TelcoServiceService) {}

  @EventPattern('vodacom')
  handleVodacomRequest(data: any){
    this.telcoServiceService.handleTelcoRequest(data.value)
  }

  @EventPattern('airtel')
  handleAirtelRequest(data: any){
    this.telcoServiceService.handleTelcoRequest(data.value)
  }

  @EventPattern('orange')
  handleOrangeRequest(data: any){
    this.telcoServiceService.handleTelcoRequest(data.value)
  }
}
