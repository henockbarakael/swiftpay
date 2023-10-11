import { PartialType } from '@nestjs/mapped-types';
import { Commission } from './commission.dto';

export class UpdateCommission extends PartialType(Commission) {}
