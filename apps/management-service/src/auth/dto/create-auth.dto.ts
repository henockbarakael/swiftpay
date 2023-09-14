import {IsDateString, IsNotEmpty, IsOptional, IsString, IsIn} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateAuthDto {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    MiddleName: string;

    @IsDateString({}, { each: true })
    @IsOptional()
    birthDate: Date;

    @IsIn(['M', 'F'])
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsOptional()
    address: string;
    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    role: string;

}
