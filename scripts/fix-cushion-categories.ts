import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixCushionCategories() {
  try {
    // Find cushions/pillows with wrong category
    const wrongCategoryCushions = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: 'cushion', mode: 'insensitive' } },
              { title: { contains: 'pillow', mode: 'insensitive' } },
              { title: { contains: 'bolster', mode: 'insensitive' } },
            ]
          },
          {
            category: {
              notIn: ['Cushions', 'Cushion Covers', 'Bedding', 'Pillows', 'Living Room']
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        room: true
      }
    })

    console.log(`Found ${wrongCategoryCushions.length} cushions with incorrect categories\n`)
    
    let updated = 0
    
    for (const product of wrongCategoryCushions) {
      // Determine correct category
      let correctCategory = 'Cushion Covers'
      
      const titleLower = product.title.toLowerCase()
      
      if (titleLower.includes('pillow') && (titleLower.includes('bed') || product.room === 'bedroom')) {
        correctCategory = 'Bedding'
      } else if (titleLower.includes('bolster')) {
        correctCategory = 'Cushion Covers'
      } else if (titleLower.includes('cushion')) {
        correctCategory = 'Cushion Covers'
      }
      
      await prisma.product.update({
        where: { id: product.id },
        data: { category: correctCategory }
      })
      
      console.log(`✅ ${product.title}`)
      console.log(`   From: ${product.category} → To: ${correctCategory}\n`)
      updated++
    }
    
    console.log(`\n🎉 Updated ${updated} products`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixCushionCategories()
