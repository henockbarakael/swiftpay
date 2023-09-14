import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  middleName: string;

  @IsDateString({}, { each: true })
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  birthDate: Date;

  @IsIn(['M', 'F'])
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  gender: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  phone: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  institutionId: string;

  @IsNotEmpty()
  @ApiProperty()
  accountStatusId: string;
}
