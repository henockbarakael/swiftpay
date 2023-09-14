import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import {
  FORBIDDEN_TO_LOGIN_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  PASSWORD_FAIL_MESSAGE,
} from 'libs/constants';
import { IUserResponse } from 'shared/types';
import { RoleEnum } from 'libs/enums';
import { DatabaseService } from 'shared/database';
import { generateUuid } from '../../../../libs/utils';
import { MerchantService } from '../merchant/merchant.service';
import { CreateMerchantDto } from '../merchant/dto/create-merchant.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: DatabaseService,
    private readonly merchantService: MerchantService,
    private jwtService: JwtService,
  ) { }
  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const userRepo = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
      if (!userRepo) {
        throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
      } else {
        const pwdMatches = await argon.verify(userRepo.password, password);
        const userRO = userRepo as unknown as IUserResponse;
        if (pwdMatches) {
          if (userRepo?.userRoles[0]?.role?.slug === RoleEnum.MERCHANT) {
            const merchant = await this.merchantService.findByUserId(
              userRepo[0]?.id,
            );
            return this.getUserAuth(merchant as unknown as IUserResponse);
          }
          return this.getUserAuth(userRO);
        } else {
          throw new NotFoundException(PASSWORD_FAIL_MESSAGE);
        }
      }
    } catch (error) {
      throw new UnauthorizedException(FORBIDDEN_TO_LOGIN_MESSAGE);
    }
  }
  async register(payload: CreateAuthDto) {
    try {
      const hash = await this.hashPassword(payload.password);
      const data = { ...payload };
      const roleSlug = data.role;

      const [role, user] = await Promise.all([
        this.findUserRole(roleSlug),
        this.createUser(data, hash),
      ]);

      if ((await this.isUserEmpty(user)) && !role) {
        throw new NotAcceptableException();
      } else if (role.slug === RoleEnum.MERCHANT) {
        return await this.createMerchant({
          userId: user.id,
          accountStatusId: payload.accountStatusId,
          institutionId: payload.institutionId,
        });
      }
    } catch (e) {
      // Gérer l'exception ici
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }
  private async createUser(
    payload: CreateAuthDto,
    hash: string,
  ): Promise<User> {
    delete payload.institutionId;
    delete payload.accountStatusId;
    delete payload.password;
    return await this.prismaService.user.create({
      data: {
        ...payload,
        password: hash,
      },
    });
  }

  private async findUserRole(roleSlug: string): Promise<Role> {
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        slug: roleSlug,
      },
    });
  }

  private async isUserEmpty(user: any): Promise<boolean> {
    return Object.keys(await user()).length === 0;
  }
  generateJWT(user: Partial<IUserResponse>) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return this.jwtService.sign(
      {
        id: user.id,
        exp: exp.getTime() / 1000,
        email: user.email,
      },
      {
        secret: jwtConstants.secret,
      },
    );
  }
  getUserAuth(payload: IUserResponse): IUserResponse {
    try {
      const response: IUserResponse = {
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.userRoles,
          isActive: payload.isActive,
          ...payload,
        },
        access_token: this.generateJWT(payload),
      } as unknown as IUserResponse;
      return response;
    } catch (error) { }
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  update(id: string, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
  private async createMerchant(payload: CreateMerchantDto) {
    try {
      return await this.merchantService.create(payload);
    } catch (e) { }
  }
}
