import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarchantService } from './marchant.service';
import { CreateMarchantDto } from './dto/create-marchant.dto';
import { UpdateMarchantDto } from './dto/update-marchant.dto';
import { ApiAcceptedResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('marchant')
@Controller('marchant')
export class MarchantController {
  constructor(private readonly marchantService: MarchantService) {}

  @Post()
  create(@Body() createMarchantDto: CreateMarchantDto) {
    return this.marchantService.create(createMarchantDto);
  }

  @Get()
  findAll() {
    return this.marchantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marchantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarchantDto: UpdateMarchantDto) {
    return this.marchantService.update(+id, updateMarchantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marchantService.remove(+id);
  }
}
