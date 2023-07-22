import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
