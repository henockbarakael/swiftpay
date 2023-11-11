import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginationDto } from 'shared/dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('merchant')
@UseGuards(JwtAuthGuard)
@ApiTags('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantService.create(createMerchantDto);
  }

  @Get('find-all-by-paginate')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.merchantService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.update(id, updateMerchantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchantService.remove(id);
  }
}
