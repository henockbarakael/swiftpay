import { PartialType } from '@nestjs/swagger';
import { CreateAccountStatusDto } from './create-account-status.dto';

export class UpdateAccountStatusDto extends PartialType(
  CreateAccountStatusDto,
) {}
