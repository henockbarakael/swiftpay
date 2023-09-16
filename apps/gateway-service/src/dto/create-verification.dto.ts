import { ActionOperationEnum } from '@prisma/client';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class CreateVerificationDto {
  @IsNotEmpty()
  merchantID: number;

  @IsNotEmpty()
  @IsPhoneNumber('CD')
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
}

export class CheckMarchantVerificationDto {
  @IsNotEmpty()
  merchantID: string;

  @IsNotEmpty()
  @IsPhoneNumber('CD')
  phoneNumber: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  service: TelcoServiceEnum;

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  action: ActionOperationEnum;
}
