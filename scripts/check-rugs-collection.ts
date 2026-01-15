import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRugsCollection() {
  try {
    // Find all products that might appear in Rugs & Runners collection
    const rugsProducts = await prisma.product.findMany({
      where: {
        OR: [
          { category: { contains: 'Rugs', mode: 'insensitive' } },
          { category: { contains: 'Runner', mode: 'insensitive' } },
          { category: { contains: 'Mat', mode: 'insensitive' } },
          { category: { contains: 'Carpet', mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        room: true
      }
    })

    console.log(`Found ${rugsProducts.length} products in Rugs & Runners related categories:\n`)
    
    // Check for cushions in this list
    const cushionsInRugs = rugsProducts.filter(p => 
      p.title.toLowerCase().includes('cushion') || 
      p.title.toLowerCase().includes('pillow')
    )
    
    if (cushionsInRugs.length > 0) {
      console.log(`❌ Found ${cushionsInRugs.length} cushion products incorrectly categorized:\n`)
      cushionsInRugs.forEach(p => {
        console.log(`- ${p.title}`)
        console.log(`  Category: ${p.category}`)
        console.log(`  Room: ${p.room}\n`)
      })
    } else {
      console.log('✅ No cushions found in Rugs & Runners category')
    }
    
    // Show breakdown by category
    const categoryCount = new Map()
    rugsProducts.forEach(p => {
      const count = categoryCount.get(p.category) || 0
      categoryCount.set(p.category, count + 1)
    })
    
    console.log('\nCategory breakdown:')
    Array.from(categoryCount.entries()).forEach(([cat, count]) => {
      console.log(`- ${cat}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

checkRugsCollection()
