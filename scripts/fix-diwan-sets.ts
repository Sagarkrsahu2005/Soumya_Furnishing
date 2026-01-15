import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDiwanSets() {
  try {
    // Find diwan sets with wrong category
    const diwanSets = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: 'diwan', mode: 'insensitive' } },
          { category: { contains: 'diwan', mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        room: true
      }
    })

    console.log(`Found ${diwanSets.length} diwan set products\n`)
    
    // Check which ones have wrong category (Rugs & Runners)
    const wrongCategory = diwanSets.filter(d => 
      d.category && (
        d.category.toLowerCase().includes('rug') || 
        d.category.toLowerCase().includes('runner') ||
        d.category.toLowerCase().includes('mat')
      )
    )
    
    if (wrongCategory.length > 0) {
      console.log(`❌ Found ${wrongCategory.length} diwan sets with incorrect category:\n`)
      
      for (const diwan of wrongCategory) {
        console.log(`- ${diwan.title}`)
        console.log(`  Category: ${diwan.category}`)
        console.log(`  Room: ${diwan.room}\n`)
        
        // Update to correct category
        await prisma.product.update({
          where: { id: diwan.id },
          data: { 
            category: 'Diwan Sets',
            room: 'living-room'
          }
        })
        
        console.log(`  ✅ Updated to: Diwan Sets, living-room\n`)
      }
      
      console.log(`\n🎉 Fixed ${wrongCategory.length} diwan set products`)
    } else {
      console.log('✅ All diwan sets are properly categorized')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixDiwanSets()
