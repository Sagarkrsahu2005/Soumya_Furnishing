/*
  Production-level product categorization
  Run: pnpm categorize
*/

import { prisma } from '@/lib/db'

// Comprehensive category mapping with primary and secondary keywords
const CATEGORY_MAPPING = {
  'Bedding': {
    primary: ['bedsheet', 'bed sheet', 'fitted sheet', 'flat sheet', 'bed linen', 'bedcover set', 'bed cover set', 'bedcover', 'bed cover', 'duvet', 'comforter', 'bedspread', 'coverlet', 'bedding set', 'sheet set', 'bed set', 'quilt set', 'bed quilt', 'double bedsheet', 'single bedsheet', 'king bedsheet', 'double bedcover', 'single bedcover', 'king bedcover'],
    secondary: ['king size bed', 'queen size bed', 'double bed', 'single bed', 'mattress protector', 'mattress cover', 'quilt'],
    exclude: ['cushion', 'cushion cover', 'decorative pillow', 'throw pillow', 'accent pillow', 'cushion set'] // Don't categorize as bedding if these are the MAIN product
  },
  'Cushions & Pillows': {
    primary: ['cushion', 'cushion cover', 'throw pillow', 'decorative pillow', 'accent pillow', 'bolster', 'floor cushion', 'seat cushion'],
    secondary: ['pillow', 'pillow cover', 'pillowcase'],
    exclude: ['bedcover', 'bed cover', 'bedsheet', 'bed sheet', 'bedding', 'comforter', 'duvet'] // Don't categorize as cushion if it's bedding
  },
  'Curtains & Drapes': {
    primary: ['curtain', 'drape', 'window curtain', 'door curtain', 'sheer curtain', 'blackout curtain', 'window treatment', 'valance', 'panel', 'window panel'],
    secondary: ['window', 'sheer'],
    exclude: []
  },
  'Rugs & Runners': {
    primary: ['rug', 'area rug', 'floor rug', 'carpet', 'runner', 'floor runner', 'doormat', 'door mat', 'bath mat', 'floor mat', 'dhurrie', 'kilim'],
    secondary: ['mat'],
    exclude: ['place mat', 'placemat', 'yoga mat', 'table runner']
  },
  'Table Linen': {
    primary: ['tablecloth', 'table cloth', 'table cover', 'table linen', 'napkin', 'dinner napkin', 'table napkin', 'placemat', 'place mat', 'table mat', 'coaster', 'table runner'],
    secondary: ['dining', 'table setting'],
    exclude: []
  },
  'Throws & Blankets': {
    primary: ['throw', 'throw blanket', 'blanket', 'afghan', 'lap blanket', 'fleece blanket', 'wool blanket', 'cotton blanket', 'knit throw'],
    secondary: ['wrap', 'shawl'],
    exclude: []
  },
  'Wall Decor': {
    primary: ['wall hanging', 'wall art', 'tapestry', 'wall tapestry', 'wall textile', 'macrame', 'wall decor', 'hanging art'],
    secondary: ['wall', 'hanging'],
    exclude: ['curtain', 'drape']
  },
  'Kitchen Textiles': {
    primary: ['kitchen towel', 'dish towel', 'tea towel', 'apron', 'oven mitt', 'oven glove', 'pot holder', 'kitchen linen'],
    secondary: ['kitchen'],
    exclude: []
  },
  'Bath Textiles': {
    primary: ['bath towel', 'hand towel', 'face towel', 'bath mat', 'bath rug', 'shower curtain', 'bathrobe', 'bath linen', 'washcloth'],
    secondary: ['bathroom', 'bath'],
    exclude: []
  },
  'Upholstery': {
    primary: ['upholstery fabric', 'furniture cover', 'sofa cover', 'chair cover', 'slipcover', 'ottoman cover'],
    secondary: ['upholstery', 'furniture'],
    exclude: []
  }
}

// Normalize text for better matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

// Check if text contains any of the keywords
function containsKeyword(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text)
  return keywords.some(keyword => {
    const normalizedKeyword = normalizeText(keyword)
    return normalized.includes(normalizedKeyword)
  })
}

// Advanced categorization with scoring
function categorizeProduct(title: string, description?: string): string | null {
  const fullText = normalizeText(`${title} ${description || ''}`)
  const titleNormalized = normalizeText(title)
  
  // Score each category
  const scores: Record<string, number> = {}
  
  for (const [category, config] of Object.entries(CATEGORY_MAPPING)) {
    let score = 0
    
    // STRONG exclusion check - if ANY exclusion keyword appears prominently, skip this category
    if (config.exclude.length > 0) {
      const hasStrongExclusion = config.exclude.some(exc => {
        const normalized = normalizeText(exc)
        // Check if exclusion appears in title (not just first 3 words)
        return titleNormalized.includes(normalized)
      })
      if (hasStrongExclusion) continue
    }
    
    // Primary keywords (higher weight)
    if (containsKeyword(fullText, config.primary)) {
      score += 10
      
      // STRONG bonus if primary keyword in title (not description)
      if (containsKeyword(titleNormalized, config.primary)) {
        score += 8
      }
      
      // Extra points if in first 5 words of title
      const firstWords = titleNormalized.split(' ').slice(0, 5).join(' ')
      if (containsKeyword(firstWords, config.primary)) {
        score += 5
      }
    }
    
    // Secondary keywords (lower weight)
    if (containsKeyword(fullText, config.secondary)) {
      score += 3
    }
    
    if (score > 0) {
      scores[category] = score
    }
  }
  
  // Return category with highest score
  if (Object.keys(scores).length > 0) {
    const sortedCategories = Object.entries(scores).sort(([, a], [, b]) => b - a)
    return sortedCategories[0][0]
  }
  
  return null
}

async function categorizeAllProducts() {
  console.log('🚀 Starting production-level categorization...\n')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      descriptionHtml: true,
      category: true,
    },
  })
  
  console.log(`📦 Found ${products.length} products\n`)
  
  let categorized = 0
  let alreadyCategorized = 0
  let uncategorized = 0
  const uncategorizedList: { id: string; title: string }[] = []
  const categoryStats: Record<string, number> = {}
  
  for (const product of products) {
    if (product.category) {
      alreadyCategorized++
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1
      continue
    }
    
    const plainDescription = product.descriptionHtml
      ?.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    const category = categorizeProduct(product.title, plainDescription)
    
    if (category) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category },
      })
      
      categoryStats[category] = (categoryStats[category] || 0) + 1
      console.log(`✓ ${product.title.substring(0, 50)}... → ${category}`)
      categorized++
    } else {
      console.log(`? ${product.title.substring(0, 50)}... → No category match`)
      uncategorized++
      uncategorizedList.push({ id: product.id, title: product.title })
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('📊 CATEGORIZATION SUMMARY')
  console.log('='.repeat(70))
  console.log(`Total products: ${products.length}`)
  console.log(`Already categorized: ${alreadyCategorized}`)
  console.log(`Newly categorized: ${categorized}`)
  console.log(`Uncategorized: ${uncategorized}`)
  
  console.log('\n📈 CATEGORY BREAKDOWN:')
  const sortedStats = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)
  for (const [category, count] of sortedStats) {
    const percentage = ((count / products.length) * 100).toFixed(1)
    console.log(`  ${category.padEnd(25)} ${count.toString().padStart(4)} (${percentage}%)`)
  }
  
  if (uncategorizedList.length > 0 && uncategorizedList.length <= 50) {
    console.log('\n⚠️  UNCATEGORIZED PRODUCTS:')
    for (const item of uncategorizedList) {
      console.log(`  - ${item.title}`)
    }
  } else if (uncategorizedList.length > 50) {
    console.log(`\n⚠️  ${uncategorizedList.length} uncategorized products`)
    console.log('First 10:')
    for (const item of uncategorizedList.slice(0, 10)) {
      console.log(`  - ${item.title}`)
    }
  }
  
  console.log('\n✅ Categorization complete!\n')
}

categorizeAllProducts()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
