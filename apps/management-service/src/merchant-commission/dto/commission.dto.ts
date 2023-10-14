import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Commission {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  action: string;

  @IsNotEmpty()
  @ApiProperty()
  commission: number;

  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;

  @IsNotEmpty()
  @ApiProperty()
  updateAt: Date;

  @IsNotEmpty()
  @ApiProperty()
  serviceId: string;
}
