import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class NotificationServiceService {
  constructor(
    @Inject('notification')
    private readonly notificationClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
