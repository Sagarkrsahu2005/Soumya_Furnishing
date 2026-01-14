/*
  Assign room/collection to products based on category and keywords
  Run: pnpm tsx scripts/assign-rooms.ts
*/

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ROOM_MAPPING = {
  'Bedroom': {
    categories: ['Bedding', 'Throws & Blankets'],
    keywords: ['bed', 'bedroom', 'bedsheet', 'bedcover', 'pillow', 'comforter', 'quilt', 'duvet']
  },
  'Living Room': {
    categories: ['Cushions & Pillows', 'Throws & Blankets', 'Rugs & Runners'],
    keywords: ['living', 'sofa', 'couch', 'lounge', 'decorative', 'accent']
  },
  'Dining': {
    categories: ['Table Linen'],
    keywords: ['dining', 'table', 'napkin', 'placemat', 'runner', 'tablecloth']
  },
  'Kitchen': {
    categories: ['Kitchen Textiles'],
    keywords: ['kitchen', 'apron', 'towel', 'pot holder', 'oven']
  },
  'Bathroom': {
    categories: ['Bath Textiles'],
    keywords: ['bath', 'bathroom', 'towel', 'shower']
  }
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

function assignRoom(title: string, category: string | null): string | null {
  const titleLower = normalizeText(title)
  
  // Check each room
  for (const [room, config] of Object.entries(ROOM_MAPPING)) {
    // Check if category matches
    if (category && config.categories.includes(category)) {
      return room
    }
    
    // Check if any keyword matches
    const hasKeyword = config.keywords.some(keyword => 
      titleLower.includes(keyword)
    )
    
    if (hasKeyword) {
      return room
    }
  }
  
  // Default assignments based on category
  if (category === 'Curtains & Drapes') return 'Living Room'
  if (category === 'Rugs & Runners') return 'Living Room'
  
  return null
}

async function main() {
  console.log('🏠 Starting room assignment...\n')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      room: true,
    }
  })
  
  console.log(`📦 Found ${products.length} products\n`)
  
  let updated = 0
  let skipped = 0
  
  for (const product of products) {
    const room = assignRoom(product.title, product.category)
    
    if (room && room !== product.room) {
      await prisma.product.update({
        where: { id: product.id },
        data: { room }
      })
      
      console.log(`✓ ${product.title.substring(0, 50)}... → ${room}`)
      updated++
    } else {
      skipped++
    }
  }
  
  console.log('\n======================================================================')
  console.log('📊 ROOM ASSIGNMENT SUMMARY')
  console.log('======================================================================')
  console.log(`Total products: ${products.length}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  
  // Show room breakdown
  const roomCounts = await prisma.product.groupBy({
    by: ['room'],
    _count: true,
    where: {
      room: { not: null }
    }
  })
  
  console.log('\n📈 ROOM BREAKDOWN:')
  roomCounts
    .sort((a, b) => b._count - a._count)
    .forEach(({ room, _count }) => {
      const percentage = (((_count / products.length) * 100).toFixed(1))
      console.log(`  ${room?.padEnd(15)} ${_count.toString().padStart(3)} (${percentage}%)`)
    })
  
  const unassigned = products.length - roomCounts.reduce((acc, r) => acc + r._count, 0)
  if (unassigned > 0) {
    console.log(`  ${'Unassigned'.padEnd(15)} ${unassigned.toString().padStart(3)}`)
  }
  
  console.log('\n✅ Room assignment complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
