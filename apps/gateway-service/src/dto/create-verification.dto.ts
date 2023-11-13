import { ApiProperty } from '@nestjs/swagger';
import { ActionOperationEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { normalizePhoneNumber } from 'libs/utils';
export class CreateVerificationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  merchantID: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  @Transform(({ value }) => normalizePhoneNumber(value))
  phoneNumber: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  key: string;

  
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  currency: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  service: any;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  reference: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  action: ActionOperationEnum;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  callback_url: string;
}

export class CheckMarchantVerificationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  merchantID: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  @Transform(({ value }) => normalizePhoneNumber(value))
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  key: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  currency: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  service: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  reference: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  action: ActionOperationEnum;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This property is required',
  })
  callback_url: string;
}
