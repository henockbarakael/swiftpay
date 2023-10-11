import { PartialType } from '@nestjs/mapped-types';
import { Commission } from '../dto/commission.dto';

export class UpdateCommission extends PartialType(Commission) {}
