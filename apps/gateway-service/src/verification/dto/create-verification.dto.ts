import { IsNotEmpty } from 'class-validator';
import { ActionOperationEnum } from 'libs/enums';
export class CreateVerificationDto {
    @IsNotEmpty()
    institutionID: number

    @IsNotEmpty()
    phoneNumber:number

    @IsNotEmpty()
    key: number

    @IsNotEmpty()
    amount:number

    @IsNotEmpty()
    currency: string

    @IsNotEmpty()
    service:string

    @IsNotEmpty()
    reference:string

    @IsNotEmpty()
    action: ActionOperationEnum
}
