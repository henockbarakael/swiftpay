import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthHelpers } from 'libs/utils/auth.helpers';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaClient, private jwtService: JwtService){}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const userRepo = await this.prismaService.user.findUnique({
        where:{
          email
        },
        include:{
          userRoles: true
        }
      });
      if (!userRepo) {
        throw new NotFoundException("cet utilisateur n'existe pas");
      } else {
        const pwdMatches = await argon.verify(
          userRepo.hashedPassword,
          password,
        );
        if (pwdMatches) {
          const userResponse =
            AuthHelpers.getInstance().renderUserResponse(userRepo);
          return userResponse;
        } else {
          throw new NotFoundException('Mot de passe erroné');
        }
      }
    } catch (error) {
      throw new NotFoundException("cet utilisateur n'existe pas");
    }
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
