
import { IsNotEmpty, IsString} from 'class-validator';
import { AccountStatus, Institution } from "@prisma/client"
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarchantDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string
    
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    institutionId: string

    @IsNotEmpty()
    @ApiProperty()
    accountStatusId: string

}
