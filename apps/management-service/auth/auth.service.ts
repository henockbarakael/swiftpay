import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaClient } from '@prisma/client';
import { AuthHelpers } from 'libs/utils/auth.helpers';
import * as argon from 'argon2';
import { FORBIDDEN_TO_LOGIN_MESSAGE, NOT_FOUND_USER_MESSAGE, PASSWORD_FAIL_MESSAGE } from 'shared/constants';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaClient){}
  async signIn(loginDto: LoginDto) {
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
        throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
      } else {
        const pwdMatches = await argon.verify(
          userRepo.hashedPassword,
          password,
        );
        if (pwdMatches) {
          const userResponse =
            AuthHelpers.getInstance().getUserAuth(userRepo);
          return userResponse;
        } else {
          throw new NotFoundException(PASSWORD_FAIL_MESSAGE);
        }
      }
    } catch (error) {
      throw new UnauthorizedException(FORBIDDEN_TO_LOGIN_MESSAGE);
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
