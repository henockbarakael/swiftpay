import { Controller, Post, Body } from '@nestjs/common';
import { CallbackServiceService } from './callback-service.service';
import { Callback } from './dto/callback.dto';

@Controller()
export class CallbackServiceController {
  constructor(
    private readonly callbackServiceService: CallbackServiceService,
  ) {}

  @Post()
  processCallback(@Body() data: any) {
    console.log('print', data);
    this.callbackServiceService.processCallback(data);
    return { message: 'callback received' };
  }
}
