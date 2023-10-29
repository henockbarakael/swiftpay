import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMerchantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  institutionId: string;

  @IsNotEmpty()
  @ApiProperty()
  accountStatusId: string;
}
