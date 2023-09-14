import { PrismaClient, User } from '@prisma/client';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';


const prisma = new PrismaClient();
const configService = new ConfigService();

async function main() {
  // Generate permissions categories
 


  const superAdminPermission = await prisma.permission.upsert({
    where: { slug: 'master' },
    update: {},
    create: {
      slug: 'master',
      name: 'Master permission',
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super_admin' },
    update: {},
    create: {
      slug: 'super_admin',
      name: 'SUPER Admin',
      permissionId: await  (superAdminPermission.then(user => user.id))
    },
  });

  const merchantPermission = await prisma.permission.upsert({
    where: { slug: 'merchant_permission' },
    update: {},
    create: {
      slug: 'merchant_permission',
      name: 'merchant permission',
    },
  });
  const merchantRole = await prisma.role.upsert({
    where: { slug: 'merchant' },
    update: {},
    create: {
      slug: 'merchant',
      name: 'Merchant',
      permissionId: await  merchantPermission.then((item)=>item.id)
    },
  });

  await prisma.rolePermission.create({
    data: {
      name: 'admin role permissions',
      slug: 'admin_role_permissions',
      roleId: await   superAdminRole.then((item)=>item.id),
      permissionId: await (superAdminPermission.then(item => item.id)),
    },
  });

  await prisma.rolePermission.create({
    data: {
      name: 'merchant role permissions',
      slug: 'merchant_role_permissions',
      roleId: await (merchantRole.then(item=> item.id)),
      permissionId: await (merchantPermission.then(item=> item.id)),
    },
  });


  const hash = await argon.hash('Pa$$wr0d');
  const user: Partial<User> = {
    email: 'admin@admin.com',
    firstName: 'Admin',
    lastName: 'Admin',
    middleName: '',
    isActive: true,
    password: hash,
  } as unknown as Partial<User>;


  const superAdmin = await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    create: {
      identifier: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      hashedPassword: user.hashedPassword,
    },
  });


  await prisma.userRole.create({
    data: {
      name:'admin user role',
      slug:'admin_user_role',
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
