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
import { Role, User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: DatabaseService,
    private readonly merchantService: MerchantService,
    private jwtService: JwtService,
  ) {}
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

      if (this.isUserEmpty(user) && !role) {
        throw new NotAcceptableException();
      } else if (role.slug === RoleEnum.MERCHANT) {
        console.log('1:', user);
        const [merchant, userRole] = await Promise.all([
          this.createMerchant({
            userId: user.id,
            accountStatusId: payload.accountStatusId,
            institutionId: payload.institutionId,
          }),
          this.createUserRole(user, role),
        ]);
        return merchant;
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
    const userDto: any = {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      city: payload?.city,
      state: payload?.state,
      country: payload?.country,
      birthDate: new Date(payload.birthDate),
      gender: payload.gender,
      address: payload.address,
      isActive: true,
      phone: payload.phone,
      password: hash,
    } as unknown as Partial<User>;
    try {
      return await this.prismaService.user.create({
        data: {
          ...userDto,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  private async findUserRole(roleSlug: string): Promise<Role> {
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        slug: roleSlug,
      },
    });
  }

  private async isUserEmpty(user: any): Promise<boolean> {
    return Object.keys(user).length === 0;
  }
  private async createUserRole(user: User, role: Role): Promise<UserRole> {
    try {
      return await this.prismaService.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    } catch (error) {
      throw new Error('Method not implemented.');
    }
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
    } catch (error) {}
  }
  private async createMerchant(payload: CreateMerchantDto) {
    try {
      return await this.merchantService.create(payload);
    } catch (e) {}
  }
  async findAll(): Promise<User[]> {
    try {
      return await this.prismaService.user.findMany({
        where: { deletedAt: null },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (e) {}
  }
  async findOne(id: string): Promise<User> {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (e) {}
  }
  async remove(id: string): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (e) {}
  }
  async update(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateAuthDto,
        },
      });
    } catch (e) {}
  }
}
