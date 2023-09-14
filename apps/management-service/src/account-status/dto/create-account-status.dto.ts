import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: CurrencyEnum;
}
