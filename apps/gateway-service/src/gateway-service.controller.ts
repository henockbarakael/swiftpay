import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GatewayService } from './gateway-service.service';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
@Controller('verification')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async checkMarchant(
    @Body() checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    const result = await this.gatewayService.checkMarchant(
      checkMarchantVerificationDto,
    );
    if (result === true) {
      return {
        message:
          "your requested has been received successfuly and it's under processing",
      };
    } else {
      throw new BadRequestException('Invalid request');
    }
  }
}
