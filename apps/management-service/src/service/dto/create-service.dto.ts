import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TelcoServiceEnum } from '@prisma/client';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: TelcoServiceEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  serviceTopic: string;
}
