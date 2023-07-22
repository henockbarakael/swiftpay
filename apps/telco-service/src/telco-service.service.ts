import { Injectable } from '@nestjs/common';

@Injectable()
export class TelcoServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
