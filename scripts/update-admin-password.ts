import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return Buffer.from(password).toString('base64');
}

async function updateAdminPassword() {
  const email = 'admin@soumyafurnishings.com';
  const newPassword = 'admin123';

  const hashedPassword = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`✅ Updated password for ${email}`);
  console.log(`Password: ${newPassword}`);
}

updateAdminPassword()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
