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

  async handleTelcoRequest(data: Request) {
    console.log(data);
    // request body
    const body = {
      merchant_id: `${process.env.merchant_id}`,
      merchant_secret: `${process.env.merchant_secret}`,
      amount: data.amount,
      currency: `${data.currency}`,
      action: `${data.action.toLowerCase()}`,
      customer_number: `0${data.phoneNumber.slice(4)}`,
      firstname: `${process.env.firstname}`,
      lastname: `${process.env.lastname}`,
      email: `${process.env.email}`,
      reference: `${data.reference}`,
      method:
        data.service.toLowerCase() == 'vodacom'
          ? 'mpesa'
          : `${process.env.service.toLowerCase()}`,
      callback_url: `${data.callbackUrl}`,
    };

    const response = await axios.post(`${process.env.endpoint}`, body);

    console.log(response.data);
  }
}
