import { TelcoServiceEnum } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstitutionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: TelcoServiceEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;
}
