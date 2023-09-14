import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AccountStatusEnum } from '@prisma/client';
export class CreateAccountStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: AccountStatusEnum;
}
