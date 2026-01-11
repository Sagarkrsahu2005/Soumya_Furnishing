import { prisma } from '@/lib/db'

async function checkRugsCategory() {
  const rugs = await prisma.product.findMany({
    where: { category: 'Rugs & Runners' },
    select: { title: true, category: true },
  })
  
  console.log(`Found ${rugs.length} products in Rugs & Runners:\n`)
  
  // Look for pillow/cushion products
  const incorrectProducts = rugs.filter(p => 
    p.title.toLowerCase().includes('pillow') || 
    p.title.toLowerCase().includes('cushion')
  )
  
  if (incorrectProducts.length > 0) {
    console.log(`❌ Found ${incorrectProducts.length} INCORRECT products (pillows/cushions):`)
    incorrectProducts.forEach(p => console.log(`  - ${p.title}`))
  }
  
  console.log('\n✅ Correct rug products:')
  const correctProducts = rugs.filter(p => 
    !p.title.toLowerCase().includes('pillow') && 
    !p.title.toLowerCase().includes('cushion')
  )
  correctProducts.slice(0, 10).forEach(p => console.log(`  - ${p.title}`))
}

checkRugsCategory().catch(console.error).finally(() => prisma.$disconnect())
