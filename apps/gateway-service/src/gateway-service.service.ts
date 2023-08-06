import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'shared/types/request.type';

@Injectable()
export class GatewayServiceService {
  constructor(
    @Inject('gateway')
    private readonly gatewayClient: ClientKafka,
  ) {}

  processRequest(data: Request){
    console.log(data)
    this.gatewayClient.emit('vodacom', data.toString())
    return;
  }
}
