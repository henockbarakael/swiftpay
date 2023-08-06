import { PartialType } from "@nestjs/mapped-types";
import { Commission } from "shared/types/commission.type";

export class UpdateCommission extends PartialType(Commission){}