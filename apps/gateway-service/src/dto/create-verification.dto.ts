import { ActionOperationEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { normalizePhoneNumber } from 'libs/utils';
export class CreateVerificationDto {
  @IsNotEmpty()
  merchantID: number;

  @IsNotEmpty()
  @Transform(({ value }) => normalizePhoneNumber(value))
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
  @Transform(({ value }) => normalizePhoneNumber(value))
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
