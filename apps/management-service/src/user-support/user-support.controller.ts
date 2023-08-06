import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserSupportService } from './user-support.service';
import { CreateUserSupportDto } from './dto/create-user-support.dto';
import { UpdateUserSupportDto } from './dto/update-user-support.dto';
import { PaginationDto } from 'shared/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('marchant')
@Controller('user-support')
export class UserSupportController {
  constructor(private readonly userSupportService: UserSupportService) {}

  @Post()
  create(@Body() createUserSupportDto: CreateUserSupportDto) {
    return this.userSupportService.create(createUserSupportDto);
  }

  @Get()
  findAll(@Query() userSupportQuery: PaginationDto) {
    return this.userSupportService.findAll(userSupportQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSupportService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSupportDto: UpdateUserSupportDto) {
    return this.userSupportService.update(id, updateUserSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSupportService.remove(id);
  }
}
