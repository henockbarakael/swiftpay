import { ActionOperationEnum } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { NormalizePhoneNumber } from 'shared/decorators';
export class CreateVerificationDto {
  @IsNotEmpty()
  merchantID: number;

  @IsNotEmpty()
  @NormalizePhoneNumber()
  phoneNumber: number;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  service: any;

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  action: ActionOperationEnum;

  @IsNotEmpty()
  callback_url: string;
}

export class CheckMarchantVerificationDto {
  @IsNotEmpty()
  merchantID: string;

  @IsNotEmpty()
  @NormalizePhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  action: ActionOperationEnum;

  @IsNotEmpty()
  callback_url: string;
}
