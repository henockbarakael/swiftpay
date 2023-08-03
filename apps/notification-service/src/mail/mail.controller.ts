import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send-reset-pwd-mail')
  async sendResetPasswordEmail(
  @Payload() data: string,
  @Ctx() context: KafkaContext,
  ) {
  const message = context.getMessage();
  // const { offset } = context.getMessage();
  //     const partition = context.getPartition();
  //     const topic = context.getTopic();
  // await this.client.commitOffsets([{ topic, partition, offset }])
  this.mailService.sendResetPasswordEmail(data);

  return true;
}

@EventPattern('send-wallet-verification')
async walletVerification(@Payload() data: any,  @Ctx() context: KafkaContext){
  await this.mailService.sendWalletVerification(data)
}

}
