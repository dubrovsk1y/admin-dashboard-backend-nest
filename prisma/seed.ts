import { PrismaClient } from '@prisma/client';
import { INITIAL_USER_CONFIG } from './constants/initialValues';

const prisma = new PrismaClient();

async function main() {
  const initialUser = await prisma.user.upsert(INITIAL_USER_CONFIG);
  console.log(`Initial user: ${initialUser.firstName} ${initialUser.lastName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
