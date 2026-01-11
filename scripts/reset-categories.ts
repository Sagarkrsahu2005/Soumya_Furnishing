import { prisma } from '@/lib/db'

async function resetCategories() {
  console.log('🔄 Resetting all product categories...\n')
  
  const result = await prisma.product.updateMany({
    data: {
      category: null,
    },
  })
  
  console.log(`✅ Reset ${result.count} products\n`)
}

resetCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
