import { Injectable } from '@nestjs/common';

@Injectable()
export class CallbackServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
