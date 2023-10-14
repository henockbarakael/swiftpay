import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Parameter {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  key: string;

  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsNotEmpty()
  @ApiProperty()
  value: string;
}
