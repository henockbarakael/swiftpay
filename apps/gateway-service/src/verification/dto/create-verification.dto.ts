import { ActionOperationEnum, CurrencyEnum, TelcoServiceEnum } from '@prisma/client';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class CreateVerificationDto {
    @IsNotEmpty()
    machantID: number

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber:number

    @IsNotEmpty()
    key: string

    @IsNotEmpty()
    amount:number

    @IsNotEmpty()
    currency: string

    @IsNotEmpty()
    service:any

    @IsNotEmpty()
    reference:string

    @IsNotEmpty()
    action: ActionOperationEnum
}

export class CheckMarchantVerificationDto{
    @IsNotEmpty()
    machantID: string

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber:string

    @IsNotEmpty()
    key: string

    @IsNotEmpty()
    amount:number

    @IsNotEmpty()
    currency: CurrencyEnum

    @IsNotEmpty()
    service:TelcoServiceEnum

    @IsNotEmpty()
    reference:string

    @IsNotEmpty()
    action: ActionOperationEnum
 
}