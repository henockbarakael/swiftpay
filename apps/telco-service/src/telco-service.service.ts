import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'shared/types/request.event';
import axios from 'axios';

@Injectable()
export class TelcoServiceService {
  constructor(
    @Inject('telco')
    private readonly telcoClient: ClientKafka,
  ) {}

  handleTelcoRequest(data: Request) {
    console.log(process.env.endpoint);

    // call axios to send request to freshpay
    // wait for a callback
    // process the callback
    console.log(data);
  }
}
