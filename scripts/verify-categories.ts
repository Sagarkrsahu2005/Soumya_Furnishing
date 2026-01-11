import { prisma } from '@/lib/db'

async function verifyCategories() {
  console.log('🔍 Verifying specific product categories...\n')
  
  // Check cushion products
  const cushions = await prisma.product.findMany({
    where: {
      title: {
        contains: 'Quilted',
        mode: 'insensitive'
      },
      title: {
        contains: 'Cushion',
        mode: 'insensitive'
      }
    },
    select: { title: true, category: true },
    take: 5
  })
  
  console.log('Quilted Cushion Products:')
  cushions.forEach(p => console.log(`  ${p.category}: ${p.title.substring(0, 60)}...`))
  
  // Check bedding products
  const bedding = await prisma.product.findMany({
    where: {
      title: {
        contains: 'Bed',
        mode: 'insensitive'
      }
    },
    select: { title: true, category: true },
    take: 10
  })
  
  console.log('\nBed Products:')
  bedding.forEach(p => console.log(`  ${p.category}: ${p.title.substring(0, 60)}...`))
}

verifyCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
