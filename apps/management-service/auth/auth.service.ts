import { AuthUtilsService } from './../../../libs/auth-utils/src/auth-utils.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaClient } from '@prisma/client';

import * as argon from 'argon2';
import { FORBIDDEN_TO_LOGIN_MESSAGE, NOT_FOUND_USER_MESSAGE, PASSWORD_FAIL_MESSAGE } from 'shared/constants';
import { IUserResponse } from 'shared/types';
import { RoleEnum } from 'libs/enums';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaClient, private readonly authUtilsService:AuthUtilsService){}
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
        const userRO = userRepo as unknown as IUserResponse
        if (pwdMatches) {
          if (userRepo.userRoles.find(role=>role.slug=== RoleEnum.MARCHANT)) {
            const marchant = await this.prismaService.merchant.findMany({where:{
              AND:[
                {
                  userId: userRepo.id
                }
              ]
            },
            include:{
              user: true,
              accountStatus: true,
              MerchantWallet: true,
              MerchantAccountParameter: true
            }
          })[0]
            return  this.authUtilsService.getUserAuth(marchant);
          }
          return this.authUtilsService.getUserAuth(userRO)
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
