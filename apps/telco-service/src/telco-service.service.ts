import { Injectable } from '@nestjs/common';
import { Request } from 'shared/types/request.event';
import axios from 'axios';

@Injectable()
export class TelcoServiceService {
  async handleTelcoRequest(data: Request) {
    console.log(data);
    // request body
    try {
      const body = {
        merchant_id: `${process.env.merchant_id}`,
        merchant_secret: `${process.env.merchant_secret}`,
        amount: data.amount,
        currency: `${data.currency.toUpperCase()}`,
        action: `${data.action.toLowerCase()}`,
        customer_number: `${data.phoneNumber}`,
        firstname: `${process.env.firstname}`,
        lastname: `${process.env.lastname}`,
        email: `${process.env.email}`,
        reference: `${data.reference}`,
        method:
          data.service.toLowerCase() == 'vodacom'
            ? 'mpesa'
            : `${data.service.toLowerCase()}`,
        callback_url: 'http://143.110.169.188:3700/',
      }; 

      const response = await axios.post(`${process.env.endpoint}`, body);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
