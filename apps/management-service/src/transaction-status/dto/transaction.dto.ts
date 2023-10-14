import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TransactionStatus {
  @IsOptional()
  @ApiProperty()
  statusId?: string;

  @IsOptional()
  @ApiProperty()
  statusLiteral?: string;

  @IsOptional()
  @ApiProperty()
  Reference: string;
}
