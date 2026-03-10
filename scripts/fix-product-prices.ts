import { prisma } from '@/lib/prisma'

async function fixAllProductPrices() {
  try {
    console.log('\n🔧 Starting price fix...\n')
    
    // Get all products
    const products = await prisma.product.findMany()
    
    console.log(`Found ${products.length} products to update\n`)
    
    let updated = 0
    let skipped = 0
    
    for (const product of products) {
      // Skip if price is 0 or already seems correct (> 10000 = > ₹100)
      if (product.price === 0) {
        console.log(`⏭️  Skipped: ${product.title} (price is 0)`)
        skipped++
        continue
      }
      
      if (product.price > 10000) {
        console.log(`⏭️  Skipped: ${product.title} (already ₹${(product.price / 100).toFixed(2)})`)
        skipped++
        continue
      }
      
      const oldPrice = product.price
      const newPrice = product.price * 100
      
      await prisma.product.update({
        where: { id: product.id },
        data: { 
          price: newPrice,
          compareAtPrice: product.compareAtPrice ? product.compareAtPrice * 100 : null
        }
      })
      
      console.log(`✅ ${product.title}`)
      console.log(`   ₹${(oldPrice / 100).toFixed(2)} → ₹${(newPrice / 100).toFixed(2)}`)
      updated++
    }
    
    console.log(`\n✨ Price fix complete!`)
    console.log(`   Updated: ${updated} products`)
    console.log(`   Skipped: ${skipped} products\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixAllProductPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
