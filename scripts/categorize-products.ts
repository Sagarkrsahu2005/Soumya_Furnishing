/*
  Auto-categorize products based on title keywords
  Run: pnpm categorize
*/

import { prisma } from '@/lib/db'

// Category keywords mapping
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Bedding': ['bed', 'sheet', 'duvet', 'comforter', 'quilt', 'bedspread', 'mattress', 'pillow case'],
  'Cushions & Pillows': ['cushion', 'pillow', 'throw pillow'],
  'Curtains & Drapes': ['curtain', 'drape', 'window', 'sheer', 'valance'],
  'Rugs & Runners': ['rug', 'runner', 'carpet', 'mat', 'doormat'],
  'Table Linen': ['tablecloth', 'table cloth', 'napkin', 'placemat', 'table runner'],
  'Throws & Blankets': ['throw', 'blanket', 'afghan'],
  'Wall Decor': ['wall', 'tapestry', 'hanging'],
}

function categorizeProduct(title: string): string | null {
  const lowerTitle = title.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return category
      }
    }
  }
  
  return null
}

async function categorizeProducts() {
  console.log('Starting auto-categorization...')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      category: true,
    },
  })
  
  console.log(`Found ${products.length} products`)
  
  let categorized = 0
  let alreadyCategorized = 0
  let uncategorized = 0
  
  for (const product of products) {
    if (product.category) {
      alreadyCategorized++
      continue
    }
    
    const category = categorizeProduct(product.title)
    
    if (category) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category },
      })
      console.log(`✓ ${product.title} → ${category}`)
      categorized++
    } else {
      console.log(`? ${product.title} → No category match`)
      uncategorized++
    }
  }
  
  console.log('\n=== Summary ===')
  console.log(`Total products: ${products.length}`)
  console.log(`Already categorized: ${alreadyCategorized}`)
  console.log(`Newly categorized: ${categorized}`)
  console.log(`Uncategorized: ${uncategorized}`)
}

categorizeProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
