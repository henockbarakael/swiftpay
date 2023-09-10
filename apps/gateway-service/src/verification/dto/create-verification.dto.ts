import {
  ActionOperationEnum,
  CurrencyEnum,
  TelcoServiceEnum,
} from '@prisma/client';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class CreateVerificationDto {
  @IsNotEmpty()
  merchantID: number;

  @IsNotEmpty()
  @IsPhoneNumber()
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

  @IsPhoneNumber('CD')
  customerNumber: string;
}

export class CheckMarchantVerificationDto {
  @IsNotEmpty()
  merchantID: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: CurrencyEnum;

  @IsNotEmpty()
  service: TelcoServiceEnum;

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  action: ActionOperationEnum;

  @IsPhoneNumber('CD')
  customerNumber: string;
}
