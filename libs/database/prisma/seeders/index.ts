import { PrismaClient, User } from '@prisma/client';
import * as argon from 'argon2';
import { RoleEnum } from '../../../enums/role.enum';

const prisma = new PrismaClient();

async function main() {
  const permissions = ['invite', 'create', 'update', 'read', 'delete'];
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

  const accountStatus = await prisma.accountStatus.create({
    data: { name: 'ACTIVE' },
  });

  const rootRole = await prisma.role.upsert({
    where: { slug: RoleEnum.ROLE_ROOT },
    update: {},
    create: {
      slug: RoleEnum.ROLE_ROOT,
      name: 'root',
    },
  });
  const adminRole = await prisma.role.upsert({
    where: { slug: RoleEnum.ROLE_ADMIN },
    update: {},
    create: {
      slug: RoleEnum.ROLE_ADMIN,
      name: 'admin',
    },
  });
  const managerRole = await prisma.role.upsert({
    where: { slug: RoleEnum.ROLE_MANAGER },
    update: {},
    create: {
      slug: RoleEnum.ROLE_MANAGER,
      name: 'manager',
    },
  });
  if (managerRole) {
    const permissionsRepo = (await prisma.permission.findMany()).filter(
      (item) => !item.slug.includes('delete') && !item.slug.includes('update'),
    );
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${rootRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const whiterRole = await prisma.role.upsert({
    where: { slug: RoleEnum.ROLE_WRITER },
    update: {},
    create: {
      slug: RoleEnum.ROLE_WRITER,
      name: 'whiter',
    },
  });
  if (whiterRole) {
    const permissionsRepo = (await prisma.permission.findMany()).filter(
      (item) =>
        !item.slug.includes('delete') &&
        !item.slug.includes('update') &&
        !item.slug.includes('invite'),
    );
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${rootRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: whiterRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const freeUserRole = await prisma.role.upsert({
    where: { slug: RoleEnum.ROLE_FREE_USER },
    update: {},
    create: {
      slug: RoleEnum.ROLE_FREE_USER,
      name: 'free_user',
    },
  });
  if (freeUserRole) {
    const permissionsRepo = (await prisma.permission.findMany()).filter(
      (item) =>
        !item.slug.includes('delete') &&
        !item.slug.includes('update') &&
        !item.slug.includes('invite') &&
        !item.slug.includes('create'),
    );
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${rootRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: freeUserRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  if (rootRole.slug === RoleEnum.ROLE_ROOT) {
    const permissionsRepo = await prisma.permission.findMany();
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${rootRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: rootRole.id,
          permissionId: permission.id,
        },
      });
    }
    const hash = await argon.hash('Pa$$wr0d');
    const user: Partial<User> = {
      email: 'root@swyftpay-drc.com',
      firstName: 'SuperAdmin',
      lastName: 'SuperAdmin',
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
        isMerchant: false,
      },
    });
    await prisma.userRole.create({
      data: {
        userId: superAdmin.id,
        roleId: rootRole.id,
      },
    });
    await prisma.userSupport.create({
      data: {
        userId: superAdmin.id,
        accountStatusId: accountStatus.id,
      },
    });
  }
  if (adminRole.slug === RoleEnum.ROLE_ADMIN) {
    const permissionsRepo = (await prisma.permission.findMany()).filter(
      (item) => !item.slug.includes('delete'),
    );
    for await (const permission of permissionsRepo) {
      await prisma.rolePermission.upsert({
        where: {
          slug: permission.slug,
        },
        update: {},
        create: {
          name: `${rootRole.slug}_${permission.slug}`,
          slug: permission.slug,
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
    const hash = await argon.hash('Pa$$wr0d');
    const user: Partial<User> = {
      email: 'admin@swyftpay-drc.com',
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
        isMerchant: false,
      },
    });
    await prisma.userRole.create({
      data: {
        userId: superAdmin.id,
        roleId: rootRole.id,
      },
    });
    await prisma.userSupport.create({
      data: {
        userId: superAdmin.id,
        accountStatusId: accountStatus.id,
      },
    });
  }

  await prisma.currency.deleteMany();

  await prisma.currency.createMany({
    data: [{ currency: 'CDF' }, { currency: 'USD' }],
  });

  await prisma.transactionStatus.createMany({
    data: [{ status: 'PENDING' }, { status: 'FAILED' }, { status: 'SUCCESS' }],
  });

  await prisma.service.createMany({
    data: [
      { name: 'vodacom', serviceTopic: 'vodacom' },
      { name: 'orange', serviceTopic: 'orange' },
      { name: 'airtel', serviceTopic: 'airtel' },
    ],
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
