import {
  ConflictException,
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
import { DatabaseService } from 'shared/database';
import { MerchantService } from '../merchant/merchant.service';
import { JwtService } from '@nestjs/jwt';
import { Merchant, Role, User, UserRole } from '@prisma/client';
import { CreateMerchantDto } from '../merchant/dto/create-merchant.dto';
import { UserTypeEnum } from 'libs/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: DatabaseService,
    private readonly merchantService: MerchantService,
    private jwtService: JwtService,
  ) {}
  async signIn(loginDto: LoginDto): Promise<IUserResponse> {
    const { email, password } = loginDto;

    const user = await this.validateUser({ email, password });
    return await this.getUserAuth(user);
  }

  async register(payload: CreateAuthDto) {
    try {
      const existUser = await this.prismaService.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (existUser) {
        throw new ConflictException('This user exist ');
      }
      const hash = await this.hashPassword(payload.password);
      const data = { ...payload };
      const roleSlug = data.role;

      const [role, user] = await Promise.all([
        this.findUserRole(roleSlug),
        this.createUser(data, hash),
      ]);
      if (!this.isUserEmpty(user) && role) {
        if (payload.type === UserTypeEnum.MERCHANT) {
          await this.handleMerchantUser(user, payload);
        } else {
          await this.handleRegularUser(user, payload);
        }
        await this.createOrUpdateUserRole(user, role);
        return user;
      } else {
        throw new NotAcceptableException();
      }
    } catch (e) {
      // Gérer l'exception ici
    }
  }
  async findExistMerchant(merchantId: string): Promise<Merchant> {
    return await this.merchantService.findOne(merchantId);
  }

  async handleMerchantUser(user: User, payload: CreateAuthDto): Promise<void> {
    let existMerchant = null;
    if (payload.merchantId !== '' || payload.merchantId === undefined) {
      existMerchant = await this.findExistMerchant(payload.merchantId);
      this.update(user.id, { merchantId: existMerchant.id });
    } else {
      const merchant = await this.addNewMerchant({
        name: payload.merchantName,
        accountStatusId: payload.accountStatusId,
        institutionId: payload.institutionId,
      });
      this.update(user.id, { merchantId: merchant.id });
    }
  }
  async handleRegularUser(user: User, payload: CreateAuthDto): Promise<void> {
    await this.prismaService.userSupport.create({
      data: {
        accountStatusId: payload.accountStatusId,
        userId: user.id,
      },
    });
  }
  async createOrUpdateUserRole(user: User, role: Role): Promise<void> {
    await this.prismaService.userRole.create({
      data: {
        roleId: role.id,
        userId: user.id,
      },
    });
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
  private async validateUser(loginDto: LoginDto) {
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
          merchant: true,
          userSupport: true,
        },
      });
      if (!userRepo) {
        throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
      } else {
        const pwdMatches = await argon.verify(userRepo.password, password);

        const userRO = userRepo as unknown as IUserResponse;
        if (pwdMatches) {
          return userRO;
        } else {
          throw new UnauthorizedException("Vous n'êtes pas autorisé ");
        }
      }
    } catch (error) {
      throw new UnauthorizedException(FORBIDDEN_TO_LOGIN_MESSAGE);
    }
  }
  async generateJWTAccessToken(user: Partial<IUserResponse>) {
    return await this.jwtService.signAsync(user, {
      expiresIn: '1h',
      secret: process.env.JWT_REFRESH_TOKEN_KEY,
    });
  }
  async generateJWTRefeshToken(payload: IUserResponse) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_TOKEN_KEY,
    });
  }
  async getUserAuth(payload: IUserResponse): Promise<IUserResponse> {
    try {
      const response: IUserResponse = {
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.userRoles,
          isActive: payload.isActive,
          ...payload,
        },
        accessToken: await this.generateJWTAccessToken(payload),
        refeshToken: await this.generateJWTRefeshToken(payload),
      } as unknown as IUserResponse;
      return response;
    } catch (error) {}
  }
  private async addNewMerchant(payload: CreateMerchantDto) {
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
