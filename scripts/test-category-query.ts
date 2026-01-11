import { prisma } from '@/lib/db'

async function testCategoryQuery() {
  console.log('Testing category queries...\n')
  
  // Test with exact category name
  const bedding = await prisma.product.findMany({
    where: { category: 'Bedding' },
    select: { title: true },
    take: 5,
  })
  
  console.log('Products with category="Bedding":')
  bedding.forEach(p => console.log(`  - ${p.title}`))
  
  const cushions = await prisma.product.findMany({
    where: { category: 'Cushions & Pillows' },
    select: { title: true },
    take: 5,
  })
  
  console.log('\nProducts with category="Cushions & Pillows":')
  cushions.forEach(p => console.log(`  - ${p.title}`))
  
  // Check all unique categories
  const allCategories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  })
  
  console.log('\nAll unique categories in database:')
  allCategories.forEach(c => console.log(`  - "${c.category}"`))
}

testCategoryQuery()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
