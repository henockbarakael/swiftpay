import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {TelcoServiceEnum} from "@prisma/client";

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: TelcoServiceEnum
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    serviceTopic: string

}
