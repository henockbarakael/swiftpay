import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlacklistDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  number: string;
}
