import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class GatewayServiceService {
  constructor(
    @Inject('gateway')
    private readonly gatewayClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
