import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'shared/types/request.event';

@Injectable()
export class TelcoServiceService {
  constructor(
    @Inject('telco')
    private readonly telcoClient: ClientKafka,
  ) {}

  handleTelcoRequest(data: Request) {
    // call axios to send request to freshpay
    // wait for a callback
    // process the callback
    console.log(data);
    return;
  }
}
