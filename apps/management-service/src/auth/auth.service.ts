import {AuthUtilsService} from 'shared/auth-utils';
import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreateAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {LoginDto} from './dto/login.dto';
import * as argon from 'argon2';
import {FORBIDDEN_TO_LOGIN_MESSAGE, NOT_FOUND_USER_MESSAGE, PASSWORD_FAIL_MESSAGE} from 'libs/constants';
import {IUserResponse} from 'shared/types';
import {RoleEnum} from 'libs/enums';
import {DatabaseService} from 'shared/database';
import {generateUuid} from "../../../../libs/utils";
import {MerchantService} from "../merchant/merchant.service";
import {CreateMerchantDto} from "../merchant/dto/create-merchant.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prismaService:DatabaseService, private readonly authUtilsService:AuthUtilsService, private readonly merchantService: MerchantService){}
  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const userRepo = await this.prismaService.user.findUnique({
        where:{
          email
        },
        include:{
          userRoles: {
              include:{
                  role: true
              }
          }
        }
      });
      if (!userRepo) {
        throw new NotFoundException(NOT_FOUND_USER_MESSAGE);
      } else {
        const pwdMatches = await argon.verify(
          userRepo.password,
          password,
        );
        const userRO = userRepo as unknown as IUserResponse
        if (pwdMatches) {
          if (userRepo?.userRoles[0]?.role?.slug=== RoleEnum.MERCHANT) {
            const merchant = await this.merchantService.findByUserId(userRepo[0]?.id)
            return  this.authUtilsService.getUserAuth(merchant as unknown as IUserResponse ) ;
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
  async  register(payload: CreateAuthDto) {

    try{
      const hash = await argon.hash(payload.password);
      const data = { ...payload };
      const roleSlug = data.role;
      const role = await this.prismaService.role.findUniqueOrThrow({
        where:{
          slug: roleSlug
        }
      })
      delete payload.role
      const user = await this.prismaService.user.create({
        data:{
          id: generateUuid(),
          ...data,
          password: hash

        }
      })
      if (role.slug === RoleEnum.MERCHANT){
        return await this.createMerchant({
          userId: user.id,
          accountStatusId: payload.accountStatusId,
          institutionId: payload.institutionId
        })
      }
    }
    catch (e) {

    }
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
  private async createMerchant(payload:CreateMerchantDto){
    try{
      return await this.merchantService.create(payload)
    }
    catch (e) {

    }
  }

}
