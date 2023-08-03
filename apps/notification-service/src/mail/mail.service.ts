import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  sendResetPasswordEmail(data: string) {
    throw new Error('Method not implemented.');
  }
}
