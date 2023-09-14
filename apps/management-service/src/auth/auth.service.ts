import {AuthUtilsService} from '../../../../libs/auth-utils/src/auth-utils.service';
import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreateAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {LoginDto} from './dto/login.dto';
import * as argon from 'argon2';
import {FORBIDDEN_TO_LOGIN_MESSAGE, NOT_FOUND_USER_MESSAGE, PASSWORD_FAIL_MESSAGE} from 'libs/constants';
import {IUserResponse} from 'shared/types';
import {RoleEnum} from 'libs/enums';
import {DatabaseService} from 'shared/database';
import {MarchantService} from '../marchant/marchant.service';
import {CreateMarchantDto} from "../marchant/dto/create-marchant.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prismaService:DatabaseService, private readonly authUtilsService:AuthUtilsService, private readonly marchantService: MarchantService){}
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
          userRepo.password,
          password,
        );
        const userRO = userRepo as unknown as IUserResponse
        if (pwdMatches) {
          if (userRepo.userRoles.find(role=>role.slug=== RoleEnum.MARCHANT)) {
            const marchant = await this.marchantService.findByUserId(userRepo.id)
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
          ...data,
          password: hash

        }
      })
      if (role.slug === RoleEnum.MARCHANT){
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

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private async createMerchant(payload:CreateMarchantDto){
    try{
      return await this.marchantService.create(payload)
    }
    catch (e) {

    }
  }

}
