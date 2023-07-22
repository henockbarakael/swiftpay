import { Controller, Get } from '@nestjs/common';
import { CallbackServiceService } from './callback-service.service';

@Controller()
export class CallbackServiceController {
  constructor(
    private readonly callbackServiceService: CallbackServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.callbackServiceService.getHello();
  }
}
