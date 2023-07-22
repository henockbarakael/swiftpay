import { Injectable } from '@nestjs/common';

@Injectable()
export class ManagementServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
