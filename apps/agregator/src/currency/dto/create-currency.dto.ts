import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  currency: CurrencyEnum;
}
