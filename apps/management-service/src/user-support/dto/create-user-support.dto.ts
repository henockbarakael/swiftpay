import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString } from 'class-validator';
export class CreateUserSupportDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string

    @IsNotEmpty()
    @ApiProperty()
    accountStatusId: string
}
