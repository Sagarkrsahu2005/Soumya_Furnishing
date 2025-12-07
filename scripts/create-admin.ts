/*
  Create an admin user for CMS access.
  Run: pnpm create-admin
*/
import { prisma } from '@/lib/db'

function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64')
}

async function createAdmin() {
  const email = process.argv[2] || 'admin@soumyafurnishings.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  try {
    const admin = await (prisma as any).admin.create({
      data: {
        email,
        password: hashPassword(password),
        name,
        role: 'super_admin'
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', admin.email)
    console.log('Password:', password)
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('❌ Admin with this email already exists')
    } else {
      console.error('❌ Error creating admin:', error.message)
    }
    process.exit(1)
  }
}

createAdmin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
