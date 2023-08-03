import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TelcoServiceService {
  constructor(
    @Inject('telco')
    private readonly telcoClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
