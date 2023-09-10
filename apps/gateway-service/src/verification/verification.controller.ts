import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  checkMarchant(
    @Body() checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    if (this.verificationService.checkMarchant(checkMarchantVerificationDto)) {
      return {
        message:
          "your requested has been received successfuly and it's under processing",
      };
    } else {
      throw new BadRequestException('Invalid request');
    }
  }
}
