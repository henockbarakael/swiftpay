import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthDto } from '../../auth/dto/create-auth.dto';

export class CreateMerchantDto extends CreateAuthDto {
  @IsString()
  userId: string;

}
