import { prisma } from '@/lib/prisma'

async function fixVariantPrices() {
  console.log('\n🔧 FIXING VARIANT PRICES...\n')
  
  const variants = await prisma.variant.findMany()
  
  console.log(`Found ${variants.length} variants\n`)
  
  let fixed = 0
  let skipped = 0
  
  for (const variant of variants) {
    // Skip if price is 0 or already seems correct (> 10000 = > ₹100)
    if (variant.price === 0) {
      console.log(`⏭️  Skip: ${variant.name} (price is 0)`)
      skipped++
      continue
    }
    
    if (variant.price > 10000) {
      console.log(`⏭️  Skip: ${variant.name} (already ₹${(variant.price / 100).toFixed(2)})`)
      skipped++
      continue
    }
    
    const oldPrice = variant.price
    const newPrice = variant.price * 100
    const newCompareAt = variant.compareAtPrice ? variant.compareAtPrice * 100 : null
    
    await prisma.variant.update({
      where: { id: variant.id },
      data: {
        price: newPrice,
        compareAtPrice: newCompareAt
      }
    })
    
    console.log(`✅ ${variant.name}`)
    console.log(`   ₹${(oldPrice / 100).toFixed(2)} → ₹${(newPrice / 100).toFixed(2)}`)
    fixed++
  }
  
  console.log(`\n✨ Variant price fix complete!`)
  console.log(`   Fixed: ${fixed} variants`)
  console.log(`   Skipped: ${skipped} variants\n`)
  
  await prisma.$disconnect()
}

fixVariantPrices().catch(console.error)
