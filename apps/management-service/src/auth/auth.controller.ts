import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('/register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('me')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh-token')
  refreshTokens(@Req() req: Request) {
    const user = req.user;
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(user, refreshToken);
  }
}
