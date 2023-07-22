import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
