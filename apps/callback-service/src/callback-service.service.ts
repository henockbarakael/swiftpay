import { Injectable } from '@nestjs/common';

@Injectable()
export class CallbackServiceService {
  processCallback(data: any) {
    console.log(data);
    return;
  }
}
