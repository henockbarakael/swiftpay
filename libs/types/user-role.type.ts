export interface IUserRoleResponse {
  role: IRole;
}

export interface IRole {
  id: number;
  name: string;
  slug: string;
  organisationId: number;
  rolePermissions: IUserRolePermissions;
  organisation: any;
}

export interface IUserRolePermissions {
  [x: string]: any;
  id: number;
}
