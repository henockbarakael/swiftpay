import { Controller, Post, Body } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  checkMarchant(
    @Body() checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    return this.verificationService.checkMarchant(checkMarchantVerificationDto);
  }
}
