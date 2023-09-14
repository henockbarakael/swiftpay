import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountStatusService } from './account-status.service';
import { CreateAccountStatusDto } from './dto/create-account-status.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('account-status')
@ApiTags('account-status')
export class AccountStatusController {
  constructor(private readonly accountStatusService: AccountStatusService) {}

  @Post()
  create(@Body() createAccountStatusDto: CreateAccountStatusDto) {
    return this.accountStatusService.create(createAccountStatusDto);
  }

  @Get()
  findAll() {
    return this.accountStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountStatusDto: UpdateAccountStatusDto,
  ) {
    return this.accountStatusService.update(id, updateAccountStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountStatusService.remove(id);
  }
}
