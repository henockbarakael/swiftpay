import { Controller, Post } from '@nestjs/common';
import { CallbackServiceService } from './callback-service.service';

@Controller()
export class CallbackServiceController {
  constructor(
    private readonly callbackServiceService: CallbackServiceService,
  ) {}

  @Post()
  processCallback(data: any) {
    this.callbackServiceService.processCallback(data);
    return {};
  }
}
