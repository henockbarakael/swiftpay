import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginationDto } from 'shared/dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDto } from 'shared/dto/user-register.dto';
import { AuthService } from '../auth/auth.service';

@Controller('merchant')
@ApiTags('merchant')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private authService: AuthService,
  ) {}

  @Post()
  create(@Body() createMerchantDto: UserRegisterDto) {
    return this.authService.register(createMerchantDto);
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
