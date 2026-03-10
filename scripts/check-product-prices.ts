import { prisma } from '@/lib/prisma'

async function fixProductPrices() {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' }
    })

    console.log('\n💰 Current Product Prices (showing first 20):\n')
    
    products.forEach(product => {
      const currentPrice = product.price / 100
      const shouldBe = product.price // If already in paise, this is correct
      console.log(`${product.title}`)
      console.log(`  Current: ₹${currentPrice.toFixed(2)} (${product.price} paise)`)
      console.log(`  Fix needed: Multiply by 100 -> ${product.price * 100} paise = ₹${(product.price * 100 / 100).toFixed(2)}`)
      console.log()
    })

    console.log('\n⚠️  To fix all prices, run: npm run fix-prices')
    console.log('This will multiply all product prices by 100\n')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

fixProductPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
