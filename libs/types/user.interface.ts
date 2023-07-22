import { IUserRoleResponse } from './';

export interface AuthResponse {
  access_token: string;
  user: IUserResponse;
}
export interface IUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  gender: string;
  city: string;
  address: string;
  state: string;
  country: string;
  picture: string;
  phone: string;
  isActive: boolean;
  userRoles: IUserRoleResponse[];
}
