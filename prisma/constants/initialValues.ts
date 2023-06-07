import { UserRole, UserStatus } from '@prisma/client';

export const INITIAL_USER_CONFIG = {
  where: { email: process.env.INITIAL_USER_EMAIL },
  update: {},
  create: {
    firstName: 'Yuriy',
    lastName: 'Dubrovskiy',
    email: process.env.INITIAL_USER_EMAIL,
    password: process.env.INITIAL_USER_PASSWORD,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    token: { create: {} },
  },
};
