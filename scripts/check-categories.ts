import { prisma } from '@/lib/db'

async function checkCategories() {
  console.log('🔍 Checking product categories...\n')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      category: true,
    },
    take: 30,
  })
  
  console.log('Sample of products and their categories:\n')
  for (const product of products) {
    console.log(`${product.category || 'UNCATEGORIZED'}: ${product.title}`)
  }
  
  console.log('\n📊 Category distribution:')
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  })
  
  for (const cat of categories) {
    console.log(`  ${cat.category || 'null'}: ${cat._count} products`)
  }
}

checkCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
