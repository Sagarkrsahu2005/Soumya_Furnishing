import { prisma } from '@/lib/db'

async function testCategoryPage() {
  const slug = 'bedding'
  
  const CATEGORY_NAMES: Record<string, string> = {
    "bedding": "Bedding",
    "cushions": "Cushions & Pillows",
    "curtains": "Curtains & Drapes",
    "rugs": "Rugs & Runners",
    "table-linen": "Table Linen",
    "throws": "Throws & Blankets",
    "wall-decor": "Wall Decor",
  }
  
  const categoryName = CATEGORY_NAMES[slug]
  console.log(`Slug: "${slug}"`)
  console.log(`Category name: "${categoryName}"`)
  
  // Test the query
  const products = await prisma.product.findMany({
    where: { category: categoryName },
    select: { title: true, category: true },
    take: 10
  })
  
  console.log(`\nFound ${products.length} products for category "${categoryName}":\n`)
  products.forEach(p => console.log(`  - ${p.title.substring(0, 70)}`))
  
  // Also check what categories exist
  console.log('\n\nAll categories in database:')
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  })
  categories.forEach(c => console.log(`  "${c.category}": ${c._count} products`))
}

testCategoryPage().catch(console.error).finally(() => prisma.$disconnect())
