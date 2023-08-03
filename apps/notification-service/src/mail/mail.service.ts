import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { i18nMails } from './internationalization';

@Injectable()
export class MailService {

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendResetPasswordEmail(payload: string) {
    const data = JSON.parse(payload);

    const url = `${this.configService.get('BASE_URL')}/auth/reset-pwd/${
      data.token
    }`;

    const text = i18nMails.resetPasswordTxt;
    const subject = i18nMails.resetPasswordSubject;
    const validation_text = i18nMails.confirm;

    await this.mailerService.sendMail({
      to: data.user.email,
      subject: subject,
      template: './confirmation',
      context: {
        name: `${data.user.firstName} ${data.user.lastName}`,
        validation_url: url,
        subject: subject,
        text,
        validation_text,
      },
    });
  }
  async sendWalletVerification(payload: string) {
    const data = JSON.parse(payload);
    const text = i18nMails.walletverificationTxt;
    await this.mailerService.sendMail({
      to: data.to,
      subject:'verify wallet',
      template: './walletverification',
      context:{
        marchantName :`${data.marchant.name}`,
        text
      }
    })
  }
}
