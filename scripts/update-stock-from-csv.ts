import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { prisma } from '@/lib/db'
import { join } from 'path'
import { homedir } from 'os'

const CSV_PATH = join(homedir(), 'Downloads', 'products_export_1.csv')

async function updateStock() {
  console.log('📦 Reading CSV file...\n')
  
  const fileContent = readFileSync(CSV_PATH, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  
  console.log(`Found ${records.length} rows in CSV\n`)
  
  let updated = 0
  let notFound = 0
  let skipped = 0
  
  for (const row of records) {
    const title = row['Title']?.trim()
    const handle = row['Handle']?.trim()
    const inventoryQty = row['Variant Inventory Qty']?.trim()
    
    // Skip empty rows or headers
    if (!title || !handle || inventoryQty === '') {
      skipped++
      continue
    }
    
    const quantity = parseInt(inventoryQty, 10)
    if (isNaN(quantity)) {
      console.log(`⚠️  Invalid quantity for "${title}": ${inventoryQty}`)
      skipped++
      continue
    }
    
    // Find product by title or handle
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { title: { equals: title, mode: 'insensitive' } },
          { slug: handle },
        ],
      },
      include: {
        variants: true,
      },
    })
    
    if (!product) {
      console.log(`❌ Not found: ${title}`)
      notFound++
      continue
    }
    
    // Update all variants of this product with the stock quantity
    if (product.variants.length > 0) {
      await prisma.variant.updateMany({
        where: { productId: product.id },
        data: { inventoryQuantity: quantity },
      })
      
      updated++
      if (updated % 50 === 0) {
        console.log(`   ✓ Updated ${updated} products...`)
      }
    } else {
      console.log(`⚠️  No variants for: ${title}`)
      skipped++
    }
  }
  
  console.log('\n✅ STOCK UPDATE COMPLETE!')
  console.log(`   📦 Updated: ${updated} products`)
  console.log(`   ❌ Not found: ${notFound} products`)
  console.log(`   ⏭️  Skipped: ${skipped} rows`)
  
  // Show sample of updated products
  const samples = await prisma.product.findMany({
    take: 5,
    include: {
      variants: {
        take: 1,
        select: {
          inventoryQuantity: true,
        },
      },
    },
  })
  
  console.log('\n📊 Sample updated products:')
  samples.forEach((p) => {
    const qty = p.variants[0]?.inventoryQuantity ?? 0
    console.log(`   ${p.title}: ${qty} in stock`)
  })
}

updateStock()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
