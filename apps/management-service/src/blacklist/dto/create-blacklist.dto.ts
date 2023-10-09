import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlacklistDto {
  @IsNotEmpty()
  @IsString()
  number: string;
}
