import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixCushionRooms() {
  try {
    // Find all products with "cushion" in title that are incorrectly assigned
    const cushions = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: 'cushion', mode: 'insensitive' } },
          { title: { contains: 'pillow', mode: 'insensitive' } },
          { category: { contains: 'cushion', mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        room: true
      }
    })

    console.log(`Found ${cushions.length} cushion/pillow products`)
    
    let updated = 0
    
    for (const cushion of cushions) {
      // Determine correct room based on category or keywords
      let correctRoom = 'living-room' // Default
      
      const titleLower = cushion.title.toLowerCase()
      const categoryLower = (cushion.category || '').toLowerCase()
      
      if (titleLower.includes('bed') || categoryLower.includes('bed')) {
        correctRoom = 'bedroom'
      } else if (titleLower.includes('dining') || categoryLower.includes('dining')) {
        correctRoom = 'dining'
      } else if (titleLower.includes('outdoor') || titleLower.includes('garden')) {
        correctRoom = 'living-room'
      }
      
      // Update if room is wrong (not living-room or bedroom)
      if (cushion.room && !['living-room', 'bedroom'].includes(cushion.room)) {
        await prisma.product.update({
          where: { id: cushion.id },
          data: { room: correctRoom }
        })
        
        console.log(`✅ Updated: ${cushion.title}`)
        console.log(`   From: ${cushion.room} → To: ${correctRoom}`)
        updated++
      } else if (!cushion.room) {
        // If no room assigned, set it
        await prisma.product.update({
          where: { id: cushion.id },
          data: { room: correctRoom }
        })
        
        console.log(`✅ Assigned: ${cushion.title} → ${correctRoom}`)
        updated++
      }
    }
    
    console.log(`\n🎉 Updated ${updated} cushion products`)
    
  } catch (error) {
    console.error('❌ Error fixing cushion rooms:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixCushionRooms()
