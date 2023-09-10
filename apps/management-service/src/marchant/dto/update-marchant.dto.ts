import { PartialType } from '@nestjs/swagger';
import { CreateMarchantDto } from './create-marchant.dto';

export class UpdateMarchantDto extends PartialType(CreateMarchantDto) {}
