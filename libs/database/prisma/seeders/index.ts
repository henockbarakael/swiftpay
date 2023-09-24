import { PrismaClient, User } from '@prisma/client';
import * as argon from 'argon2';
import { RoleEnum } from '../../../enums/role.enum';

const prisma = new PrismaClient();

async function main() {
  // Generate permissions categories
  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super_admin' },
    update: {},
    create: {
      slug: 'super_admin',
      name: 'SUPER Admin',
    },
  });

  const merchantRole = await prisma.role.upsert({
    where: { slug: 'merchant' },
    update: {},
    create: {
      slug: 'merchant',
      name: 'Merchant',
    },
  });
  const permissions = ['manage', 'invite', 'create', 'update', 'read'];

  for await (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission },
      update: {},
      create: {
        slug: permission,
        name: `${permission}_permission`,
      },
    });
  }
  if (superAdminRole.slug === RoleEnum.SUPER_ADMIN) {
    const permissionsRepo = await prisma.permission.findMany();
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${superAdminRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  if (superAdminRole.slug === RoleEnum.MERCHANT) {
    const permissionsRepo = (await prisma.permission.findMany()).filter(
      (item) => !item.slug.includes('manage'),
    );
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${superAdminRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: merchantRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

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
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      password: hash,
    },
  });

  // const role = await prisma.role.findFirst();

  // await prisma.userRole.upsert({
  //   where: {
  //     id: role.id,
  //   },
  //   update: {},
  //   create: {
  //     userId: superAdmin.id,
  //     roleId: superAdminRole.id,
  //   },
  // });

  await prisma.currency.deleteMany();

  await prisma.currency.createMany({
    data: [{ currency: 'CDF' }, { currency: 'USD' }],
  });

  await prisma.transactionStatus.createMany({
    data: [{ status: 'PENDING' }, { status: 'FAILED' }, { status: 'SUCCESS' }],
  });

  await prisma.accountStatus.createMany({
    data: [{ name: 'ACTIVE' }],
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
