import { Controller, Post, Body, BadRequestException, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { NotAcceptableException } from '@nestjs/common';
import { GatewayService } from './gateway-service.service';
import { CheckMarchantVerificationDto } from './dto/create-verification.dto';
@Controller('verification')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  @HttpCode(HttpStatus.NOT_ACCEPTABLE)
  async checkMarchant(
    @Body() checkMarchantVerificationDto: CheckMarchantVerificationDto,
  ) {
    try {const result = await this.gatewayService.checkMarchant(
      checkMarchantVerificationDto,
    );
    console.error("Gateway service checkMarchant result:", result);
    let operator;
    let currency;
    let trx_status;
    if (result.success === true) {
      console.log("Request successful");
      if(result.ack.serviceId==="6913442c-c371-4dfa-85a4-29b29e2d1b9c"){
        operator = 'airtel'
      }
      else if(result.ack.serviceId==="97030cda-6f1a-4a63-8ad8-cf06fd84a4f9"){
          operator = 'vodacom'
      }
      
      else if(result.ack.serviceId==="8f38450c-2dbb-48cc-a8cf-acd33d2086a4"){
          operator = 'orange'
      }
      
      else if(result.ack.serviceId==="863e2595-af00-479a-88f3-7e24f68646bd"){
          operator = 'africell'
      }
      if(result.ack.currencyId==="02155669-8fab-4f00-a12e-85df519b1ebe"){
        currency = 'CDF'
      }
      else if(result.ack.currencyId==="d9da77d2-b220-42ae-94d5-88fd8d91385d"){
          currency = 'USD'
      }
      
      if(result.ack.transactionStatusId==="766191b9-0eab-4670-92f4-07341720c330"){
          trx_status = 'FAILED'
      }
      else if(result.ack.transactionStatusId==="a34c90ce-1387-4fd5-8325-b16ab9e9f069"){
          trx_status = 'SUCCESS'
      }
      else if(result.ack.transactionStatusId==="aa77615f-d7a3-4682-91d4-c34b471c8aaf"){
          trx_status = 'PENDING'
      }
    
      return {
          success: result.success,
          message: "Your requested has been received successfuly and it's under processing",
          customer_number: result.ack.customerNumber,
          amount: result.ack.amount,
          currency: currency,
          service: operator,
          action: result.ack.action,
          merchant_reference: result.ack.merchantReference,
          swift_reference: result.ack.reference,
          status: trx_status,
          createdAt: result.ack.createdAt
      };
    } else {
      throw new HttpException({
        success: false,
        message: result.message,
      }, HttpStatus.NOT_ACCEPTABLE);
    }
  } catch (error) {
    throw new HttpException({
      success: false,
      message: error.message || 'Unknown error',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
}
